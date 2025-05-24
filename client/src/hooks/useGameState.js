// hooks/useGameState.js
import { useState } from "react";

export const useGameState = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [digitLength, setDigitLength] = useState(4);
  const [secret, setSecret] = useState("");
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState(
    "Welcome! Create or join a room to start playing."
  );
  const [playerName, setPlayerName] = useState("");
  const [guessHistory, setGuessHistory] = useState([]);
  const [error, setError] = useState("");
  const [gameWinner, setGameWinner] = useState("");
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTurn, setCurrentTurn] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const resetGame = () => {
    setActiveStep(0);
    setRoomId("");
    setSecret("");
    setGuess("");
    setGuessHistory([]);
    setStatus("Welcome! Create or join a room to start playing.");
    setError("");
    setGameWinner("");
    setShowWinDialog(false);
    setIsLoading(false);
    setCurrentTurn("");
    setIsMyTurn(false);
  };

  const gameState = {
    activeStep,
    roomId,
    digitLength,
    secret,
    guess,
    status,
    playerName,
    guessHistory,
    error,
    gameWinner,
    showWinDialog,
    isLoading,
    currentTurn,
    isMyTurn,
    showExitDialog,
  };

  return {
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
  };
};