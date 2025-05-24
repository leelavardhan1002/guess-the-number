import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

// Helper function to generate room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Helper function to validate secret number
function isValidSecret(secret, digitLength) {
  if (!secret || secret.length !== digitLength) return false;
  if (!/^\d+$/.test(secret)) return false;
  // Allow duplicate digits - removed unique digit requirement
  return true;
}

// Helper function to calculate correct digits in correct positions
function calculateCorrectDigits(guess, secret) {
  let correct = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      correct++;
    }
  }
  return correct;
}

// Helper function to clean up room
function cleanupRoom(roomId) {
  if (rooms.has(roomId)) {
    rooms.delete(roomId);
    console.log(`Room ${roomId} cleaned up`);
  }
}

// Helper function to find room by socket ID
function findRoomBySocketId(socketId) {
  for (const [roomId, room] of rooms.entries()) {
    if (room.players.some((p) => p.id === socketId)) {
      return roomId;
    }
  }
  return null;
}

// Helper function to get next turn player
function getNextTurnPlayer(room, currentPlayerId) {
  const currentIndex = room.players.findIndex((p) => p.id === currentPlayerId);
  const nextIndex = (currentIndex + 1) % room.players.length;
  return room.players[nextIndex];
}

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle room creation
  socket.on("createRoom", (data) => {
    try {
      // Validate input data
      if (!data || typeof data !== "object") {
        socket.emit("error", { message: "Invalid data format" });
        return;
      }

      const { digitLength, playerName } = data;

      if (
        !playerName ||
        typeof playerName !== "string" ||
        playerName.trim().length === 0
      ) {
        socket.emit("error", { message: "Player name is required" });
        return;
      }

      if (
        !digitLength ||
        typeof digitLength !== "number" ||
        digitLength < 3 ||
        digitLength > 7
      ) {
        socket.emit("error", {
          message: "Digit length must be between 3 and 7",
        });
        return;
      }

      const roomId = generateRoomId();
      const room = {
        players: [
          {
            id: socket.id,
            name: playerName.trim(),
            ready: false,
            secret: null,
          },
        ],
        digitLength: digitLength,
        gameStarted: false,
        currentTurn: null,
        turnCount: 0,
        createdAt: new Date(),
      };

      rooms.set(roomId, room);
      socket.join(roomId);

      socket.emit("roomCreated", { roomId });
      console.log(`Room ${roomId} created by ${playerName} (${socket.id})`);
    } catch (error) {
      console.error("Error creating room:", error);
      socket.emit("error", { message: "Failed to create room" });
    }
  });

  // Handle room joining
  socket.on("joinRoom", (data) => {
    try {
      // Validate input data
      if (!data || typeof data !== "object") {
        socket.emit("error", { message: "Invalid data format" });
        return;
      }

      const { roomId, playerName } = data;

      if (!roomId || typeof roomId !== "string" || roomId.trim().length === 0) {
        socket.emit("error", { message: "Room ID is required" });
        return;
      }

      if (
        !playerName ||
        typeof playerName !== "string" ||
        playerName.trim().length === 0
      ) {
        socket.emit("error", { message: "Player name is required" });
        return;
      }

      const room = rooms.get(roomId.trim().toUpperCase());

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (room.players.length >= 2) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      if (room.gameStarted) {
        socket.emit("error", { message: "Game already in progress" });
        return;
      }

      // Check if player name already exists in room
      if (
        room.players.some(
          (p) => p.name.toLowerCase() === playerName.trim().toLowerCase()
        )
      ) {
        socket.emit("error", {
          message: "Player name already taken in this room",
        });
        return;
      }

      // Add player to room
      room.players.push({
        id: socket.id,
        name: playerName.trim(),
        ready: false,
        secret: null,
      });

      socket.join(roomId);
      io.to(roomId).emit("roomJoined", {
        roomId,
        players: room.players.map((p) => ({ name: p.name, ready: p.ready })),
        digitLength: room.digitLength,
      });

      console.log(`${playerName} joined room ${roomId}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Handle secret submission
  socket.on("submitSecret", (data) => {
    try {
      if (!data || typeof data !== "object") {
        socket.emit("error", { message: "Invalid data format" });
        return;
      }

      const { roomId, secret } = data;

      if (!roomId || !secret) {
        socket.emit("error", { message: "Room ID and secret are required" });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) {
        socket.emit("error", { message: "Player not found in room" });
        return;
      }

      if (player.ready) {
        socket.emit("error", { message: "Secret already submitted" });
        return;
      }

      // Validate secret
      if (!isValidSecret(secret, room.digitLength)) {
        socket.emit("error", {
          message: `Secret must be ${room.digitLength} digits`,
        });
        return;
      }

      // Set player secret and mark as ready
      player.secret = secret;
      player.ready = true;

      console.log(`${player.name} submitted secret in room ${roomId}`);

      // Check if both players are ready
      if (room.players.length === 2 && room.players.every((p) => p.ready)) {
        room.gameStarted = true;
        // Set first player randomly
        room.currentTurn = room.players[Math.floor(Math.random() * 2)].id;
        const firstPlayer = room.players.find((p) => p.id === room.currentTurn);

        io.to(roomId).emit("startGuessing", {
          digitLength: room.digitLength,
          firstPlayer: firstPlayer.name,
        });
        console.log(
          `Game started in room ${roomId}, first turn: ${firstPlayer.name}`
        );
      }
    } catch (error) {
      console.error("Error submitting secret:", error);
      socket.emit("error", { message: "Failed to submit secret" });
    }
  });

  // Handle guess
  socket.on("makeGuess", (data) => {
    try {
      if (!data || typeof data !== "object") {
        socket.emit("error", { message: "Invalid data format" });
        return;
      }

      const { roomId, guess } = data;

      if (!roomId || !guess) {
        socket.emit("error", { message: "Room ID and guess are required" });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (!room.gameStarted) {
        socket.emit("error", { message: "Game not started yet" });
        return;
      }

      // Check if it's the player's turn
      if (room.currentTurn !== socket.id) {
        socket.emit("error", { message: "It's not your turn!" });
        return;
      }

      const currentPlayer = room.players.find((p) => p.id === socket.id);
      const opponent = room.players.find((p) => p.id !== socket.id);

      if (!currentPlayer || !opponent) {
        socket.emit("error", { message: "Player configuration error" });
        return;
      }

      if (!opponent.secret) {
        socket.emit("error", {
          message: "Opponent hasn't submitted secret yet",
        });
        return;
      }

      // Validate guess
      if (guess.length !== room.digitLength || !/^\d+$/.test(guess)) {
        socket.emit("error", {
          message: `Guess must be ${room.digitLength} digits`,
        });
        return;
      }

      // Calculate correct digits
      const correct = calculateCorrectDigits(guess, opponent.secret);
      room.turnCount++;

      // Switch turns
      room.currentTurn = opponent.id;

      // Send result to guesser
      socket.emit("guessResult", {
        guess,
        correct,
        nextTurn: opponent.name,
      });

      // Notify opponent about the guess
      socket.to(roomId).emit("opponentGuessed", {
        guess,
        correct,
        nextTurn: opponent.name,
      });

      console.log(
        `${currentPlayer.name} guessed ${guess} in room ${roomId}, ${correct} correct`
      );

      // Check if game is won
      if (correct === room.digitLength) {
        io.to(roomId).emit("gameOver", {
          winner: currentPlayer.name,
          secret: opponent.secret,
        });

        console.log(`${currentPlayer.name} won in room ${roomId}`);

        // Clean up room after a delay
        setTimeout(() => cleanupRoom(roomId), 10000);
      }
    } catch (error) {
      console.error("Error making guess:", error);
      socket.emit("error", { message: "Failed to process guess" });
    }
  });

  // Handle exit game
  socket.on("exitGame", (data) => {
    try {
      const { roomId } = data || {};
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          const currentPlayer = room.players.find((p) => p.id === socket.id);
          const opponent = room.players.find((p) => p.id !== socket.id);

          if (opponent) {
            // Notify opponent they won
            socket.to(roomId).emit("playerExited", {
              winner: opponent.name,
            });
          }

          console.log(
            `${currentPlayer?.name || "Player"} exited room ${roomId}`
          );
        }

        socket.leave(roomId);
        cleanupRoom(roomId);
      }
    } catch (error) {
      console.error("Error exiting game:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    const roomId = findRoomBySocketId(socket.id);
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        const disconnectedPlayer = room.players.find((p) => p.id === socket.id);
        const opponent = room.players.find((p) => p.id !== socket.id);

        if (opponent) {
          // Notify remaining player that opponent left
          socket.to(roomId).emit("opponentLeft");
        }

        console.log(
          `${
            disconnectedPlayer?.name || "Player"
          } disconnected from room ${roomId}`
        );

        // Clean up room
        cleanupRoom(roomId);
      }
    }
  });

  // Handle explicit leave room
  socket.on("leaveRoom", (data) => {
    try {
      const { roomId } = data || {};
      if (roomId) {
        const room = rooms.get(roomId);
        if (room) {
          const leavingPlayer = room.players.find((p) => p.id === socket.id);
          console.log(`${leavingPlayer?.name || "Player"} left room ${roomId}`);
        }

        socket.leave(roomId);
        socket.to(roomId).emit("opponentLeft");
        cleanupRoom(roomId);
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  });
});

// Clean up old rooms periodically (older than 1 hour)
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  for (const [roomId, room] of rooms.entries()) {
    if (room.createdAt < oneHourAgo) {
      console.log(`Cleaning up old room: ${roomId}`);
      cleanupRoom(roomId);
    }
  }
}, 15 * 60 * 1000); // Check every 15 minutes

// Error handling
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Waiting for client connections...");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
