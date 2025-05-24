import React from "react";
import { Container, Box, Button } from "@mui/material";
import { ExitToApp as ExitIcon } from "@mui/icons-material";
import io from "socket.io-client";

import GameStepper from "./components/GameStepper";
import TurnIndicator from "./components/TurnIndicator";
import StatusDisplay from "./components/StatusDisplay";
import ErrorAlert from "./components/ErrorAlert";
import RoomSetup from "./components/RoomSetup";
import SecretSubmission from "./components/SecretSubmission";
import GamePlay from "./components/GamePlay";
import WinDialog from "./components/WinDialog";
import ExitDialog from "./components/ExitDialog";

import { useGameState } from "./hooks/useGameState";
import { useSocketEvents } from "./hooks/useSocketEvents";
import { useNumberTracker } from "./hooks/useNumberTracker";
import HeaderPaper from "./components/HeaderPaper";

const socket = io("https://guess-the-number-production.up.railway.app/");
const steps = ["Create/Join Room", "Submit Secret", "Start Guessing"];

export default function App() {
  const {
    gameState,
    setActiveStep,
    setRoomId,
    setDigitLength,
    setSecret,
    setGuess,
    setStatus,
    setPlayerName,
    setGuessHistory,
    setError,
    setGameWinner,
    setShowWinDialog,
    setIsLoading,
    setCurrentTurn,
    setIsMyTurn,
    setShowExitDialog,
    resetGame,
  } = useGameState();

  const {
    crossedDigits,
    remainingDigits,
    numberPadHistory,
    numberPadHistoryIndex,
    toggleDigitCross,
    undoNumberPad,
    redoNumberPad,
    resetNumberPad,
  } = useNumberTracker(gameState.digitLength);

  // Socket event handling
  useSocketEvents(socket, gameState, {
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
  });

  // Game actions
  const handleCreateRoom = () => {
    if (!gameState.playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (gameState.digitLength < 3 || gameState.digitLength > 7) {
      setError("Digit length must be between 3 and 7");
      return;
    }

    setIsLoading(true);
    setError("");
    socket.emit("createRoom", {
      playerName: gameState.playerName.trim(),
      digitLength: Number(gameState.digitLength),
    });
  };

  const handleJoinRoom = () => {
    if (!gameState.roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }
    if (!gameState.playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");
    socket.emit("joinRoom", {
      roomId: gameState.roomId.trim().toUpperCase(),
      playerName: gameState.playerName.trim(),
    });
  };

  const handleSecretSubmit = () => {
    if (
      !gameState.secret ||
      gameState.secret.length !== gameState.digitLength
    ) {
      setError(
        `Enter a secret number with exactly ${gameState.digitLength} digits`
      );
      return;
    }

    if (!/^\d+$/.test(gameState.secret)) {
      setError("Secret must contain only digits (0-9)");
      return;
    }

    setError("");
    socket.emit("submitSecret", {
      roomId: gameState.roomId,
      secret: gameState.secret,
    });
    setStatus("Secret submitted successfully! Waiting for opponent...");
  };

  const handleGuess = () => {
    if (!gameState.isMyTurn) {
      setError("It's not your turn!");
      return;
    }

    if (!gameState.guess || gameState.guess.length !== gameState.digitLength) {
      setError(`Enter a guess with exactly ${gameState.digitLength} digits`);
      return;
    }

    if (!/^\d+$/.test(gameState.guess)) {
      setError("Guess must contain only digits (0-9)");
      return;
    }

    setError("");
    socket.emit("makeGuess", {
      roomId: gameState.roomId,
      guess: gameState.guess,
    });
    setGuess("");
  };

  const addDigitToGuess = (digit) => {
    if (gameState.guess.length < gameState.digitLength) {
      setGuess(gameState.guess + digit.toString());
    }
  };

  const clearGuess = () => {
    setGuess("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(gameState.roomId);
    setStatus(`Room ID ${gameState.roomId} copied to clipboard!`);
  };

  const handleExitGame = () => {
    setShowExitDialog(true);
  };

  const confirmExitGame = () => {
    socket.emit("exitGame", { roomId: gameState.roomId });
    setShowExitDialog(false);
    resetGame();
  };

  const handleDialogClose = () => {
    setShowWinDialog(false);
    resetGame();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <HeaderPaper />

      {/* Game Progress */}
      <GameStepper activeStep={gameState.activeStep} steps={steps} />

      {/* Turn Indicator */}
      {gameState.activeStep === 2 && (
        <TurnIndicator
          isMyTurn={gameState.isMyTurn}
          currentTurn={gameState.currentTurn}
        />
      )}

      {/* Status Display */}
      <StatusDisplay status={gameState.status} />

      {/* Error Display */}
      <ErrorAlert error={gameState.error} onClose={() => setError("")} />

      {/* Game Steps */}
      {gameState.activeStep === 0 && (
        <RoomSetup
          playerName={gameState.playerName}
          setPlayerName={setPlayerName}
          roomId={gameState.roomId}
          setRoomId={setRoomId}
          digitLength={gameState.digitLength}
          setDigitLength={setDigitLength}
          isLoading={gameState.isLoading}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {gameState.activeStep === 1 && (
        <SecretSubmission
          roomId={gameState.roomId}
          secret={gameState.secret}
          setSecret={setSecret}
          digitLength={gameState.digitLength}
          onSubmit={handleSecretSubmit}
          onCopyRoomId={copyRoomId}
        />
      )}

      {gameState.activeStep === 2 && (
        <GamePlay
          guess={gameState.guess}
          setGuess={setGuess}
          digitLength={gameState.digitLength}
          isMyTurn={gameState.isMyTurn}
          guessHistory={gameState.guessHistory}
          playerName={gameState.playerName}
          onGuess={handleGuess}
          onAddDigit={addDigitToGuess}
          onClearGuess={clearGuess}
          crossedDigits={crossedDigits}
          remainingDigits={remainingDigits}
          onToggleDigitCross={toggleDigitCross}
          onUndoNumberPad={undoNumberPad}
          onRedoNumberPad={redoNumberPad}
          onResetNumberPad={resetNumberPad}
          numberPadHistoryIndex={numberPadHistoryIndex}
          numberPadHistoryLength={numberPadHistory.length}
        />
      )}

      {/* Exit Game Button */}
      {gameState.activeStep > 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ExitIcon />}
            onClick={handleExitGame}
            size="large"
          >
            Exit Game
          </Button>
        </Box>
      )}

      {/* Dialogs */}
      <WinDialog
        open={gameState.showWinDialog}
        gameWinner={gameState.gameWinner}
        playerName={gameState.playerName}
        onClose={handleDialogClose}
      />

      <ExitDialog
        open={gameState.showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={confirmExitGame}
      />
    </Container>
  );
}
