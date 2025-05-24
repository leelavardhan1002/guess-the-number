import { useEffect } from "react";

export const useSocketEvents = (socket, gameState, setters) => {
  const {
    setRoomId,
    setDigitLength,
    setStatus,
    setActiveStep,
    setError,
    setIsLoading,
    setCurrentTurn,
    setIsMyTurn,
    setGuessHistory,
    setGameWinner,
    setShowWinDialog,
  } = setters;

  useEffect(() => {
    socket.on("roomCreated", ({ roomId }) => {
      setRoomId(roomId);
      setStatus(`Room created successfully! Share room ID: ${roomId}`);
      setActiveStep(1);
      setError("");
      setIsLoading(false);
    });

    socket.on("roomJoined", ({ roomId, players, digitLength }) => {
      setRoomId(roomId);
      setDigitLength(digitLength);
      setStatus(
        `Room joined successfully! Players: ${players
          .map((p) => p.name)
          .join(", ")} - Game uses ${digitLength} digits`
      );
      setActiveStep(1);
      setError("");
      setIsLoading(false);
    });

    socket.on("startGuessing", ({ digitLength, firstPlayer }) => {
      setStatus("Both players have submitted their secrets. Game started!");
      setActiveStep(2);
      setCurrentTurn(firstPlayer || gameState.playerName);
      setIsMyTurn(firstPlayer === gameState.playerName || !firstPlayer);
      setError("");
    });

    socket.on("guessResult", ({ guess, correct, nextTurn }) => {
      setGuessHistory((prev) => [
        ...prev,
        { guess, correct, player: gameState.playerName },
      ]);
      setCurrentTurn(
        nextTurn || (gameState.isMyTurn ? "Opponent" : gameState.playerName)
      );
      setIsMyTurn(!gameState.isMyTurn);

      if (correct === guess.length) {
        setStatus("🎉 Congratulations! You guessed correctly!");
        setGameWinner("You");
        setShowWinDialog(true);
      } else {
        setStatus(
          `${correct} digit(s) correct in correct position. ${
            gameState.isMyTurn ? "Your turn!" : "Opponent's turn"
          }`
        );
      }
    });

    socket.on("opponentGuessed", ({ guess, correct, nextTurn }) => {
      setGuessHistory((prev) => [
        ...prev,
        { guess, correct, player: "Opponent" },
      ]);
      setCurrentTurn(nextTurn || gameState.playerName);
      setIsMyTurn(true);
      setStatus(`Opponent guessed ${guess} (${correct} correct). Your turn!`);
    });

    socket.on("gameOver", ({ winner, secret }) => {
      setGameWinner(winner);
      setStatus(
        winner === gameState.playerName
          ? "🎉 You won the game!"
          : `😔 You lost! The secret was: ${secret}`
      );
      setShowWinDialog(true);
    });

    socket.on("playerExited", ({ winner }) => {
      setGameWinner(winner);
      setStatus("🎉 You won! Your opponent has left the game.");
      setShowWinDialog(true);
    });

    socket.on("opponentLeft", () => {
      setStatus("⚠️ Opponent disconnected. You win by default!");
      setGameWinner("You");
      setShowWinDialog(true);
    });

    socket.on("error", ({ message }) => {
      setError(message);
      setIsLoading(false);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("startGuessing");
      socket.off("guessResult");
      socket.off("opponentGuessed");
      socket.off("gameOver");
      socket.off("playerExited");
      socket.off("opponentLeft");
      socket.off("error");
    };
  }, [gameState.playerName, gameState.isMyTurn]);
};
