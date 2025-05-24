import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ExitToApp as ExitIcon,
} from "@mui/icons-material";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const steps = ["Create/Join Room", "Submit Secret", "Start Guessing"];

export default function App() {
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
  const [showSecret, setShowSecret] = useState(false);
  const [gameWinner, setGameWinner] = useState("");
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [currentTurn, setCurrentTurn] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [crossedDigits, setCrossedDigits] = useState(
    Array(digitLength)
      .fill()
      .map(() => Array(10).fill(false))
  );
  const [remainingDigits, setRemainingDigits] = useState(
    Array(digitLength).fill("")
  );
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [numberPadHistory, setNumberPadHistory] = useState([]);
  const [numberPadHistoryIndex, setNumberPadHistoryIndex] = useState(-1);

  useEffect(() => {
    setCrossedDigits(
      Array(digitLength)
        .fill()
        .map(() => Array(10).fill(false))
    );
    setRemainingDigits(Array(digitLength).fill(""));
    setNumberPadHistory([]);
    setNumberPadHistoryIndex(-1);
  }, [digitLength]);

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
      setCurrentTurn(firstPlayer || playerName);
      setIsMyTurn(firstPlayer === playerName || !firstPlayer);
      setError("");
    });

    socket.on("guessResult", ({ guess, correct, nextTurn }) => {
      setGuessHistory((prev) => [
        ...prev,
        { guess, correct, player: playerName },
      ]);
      setCurrentTurn(nextTurn || (isMyTurn ? "Opponent" : playerName));
      setIsMyTurn(!isMyTurn);

      if (correct === guess.length) {
        setStatus("🎉 Congratulations! You guessed correctly!");
        setGameWinner("You");
        setShowWinDialog(true);
      } else {
        setStatus(
          `${correct} digit(s) correct in correct position. ${
            isMyTurn ? "Your turn!" : "Opponent's turn"
          }`
        );
      }
    });

    socket.on("opponentGuessed", ({ guess, correct, nextTurn }) => {
      setGuessHistory((prev) => [
        ...prev,
        { guess, correct, player: "Opponent" },
      ]);
      setCurrentTurn(nextTurn || playerName);
      setIsMyTurn(true);
      setStatus(`Opponent guessed ${guess} (${correct} correct). Your turn!`);
    });

    socket.on("gameOver", ({ winner, secret }) => {
      setGameWinner(winner);
      setStatus(
        winner === playerName
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
  }, [playerName, isMyTurn]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (digitLength < 3 || digitLength > 7) {
      setError("Digit length must be between 3 and 7");
      return;
    }

    setIsLoading(true);
    setError("");
    socket.emit("createRoom", {
      playerName: playerName.trim(),
      digitLength: Number(digitLength),
    });
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsLoading(true);
    setError("");
    socket.emit("joinRoom", {
      roomId: roomId.trim().toUpperCase(),
      playerName: playerName.trim(),
    });
  };

  const handleSecretSubmit = () => {
    if (!secret || secret.length !== digitLength) {
      setError(`Enter a secret number with exactly ${digitLength} digits`);
      return;
    }

    if (!/^\d+$/.test(secret)) {
      setError("Secret must contain only digits (0-9)");
      return;
    }

    setError("");
    socket.emit("submitSecret", { roomId, secret });
    setStatus("Secret submitted successfully! Waiting for opponent...");
  };

  const handleGuess = () => {
    if (!isMyTurn) {
      setError("It's not your turn!");
      return;
    }

    if (!guess || guess.length !== digitLength) {
      setError(`Enter a guess with exactly ${digitLength} digits`);
      return;
    }

    if (!/^\d+$/.test(guess)) {
      setError("Guess must contain only digits (0-9)");
      return;
    }

    setError("");
    socket.emit("makeGuess", { roomId, guess });
    setGuess("");
  };

  // Number Tracker Helper Functions
  const toggleDigitCross = (column, digit) => {
    const newCrossed = crossedDigits.map((col) => [...col]);
    newCrossed[column][digit] = !newCrossed[column][digit];

    // Save current state to history before making changes
    saveNumberPadState();

    setCrossedDigits(newCrossed);
    updateRemainingDigits(newCrossed);
  };

  const updateRemainingDigits = (crossedState = crossedDigits) => {
    const newRemaining = [...remainingDigits];

    for (let col = 0; col < digitLength; col++) {
      const availableDigits = [];
      for (let digit = 0; digit <= 9; digit++) {
        if (!crossedState[col][digit]) {
          availableDigits.push(digit.toString());
        }
      }

      if (availableDigits.length === 1) {
        newRemaining[col] = availableDigits[0];
      } else {
        newRemaining[col] = "";
      }
    }

    setRemainingDigits(newRemaining);
  };

  const saveNumberPadState = () => {
    const currentState = {
      crossedDigits: crossedDigits.map((col) => [...col]),
      remainingDigits: [...remainingDigits],
    };

    const newHistory = numberPadHistory.slice(0, numberPadHistoryIndex + 1);
    newHistory.push(currentState);

    // Limit history to 20 states to prevent memory issues
    if (newHistory.length > 20) {
      newHistory.shift();
    } else {
      setNumberPadHistoryIndex((prev) => prev + 1);
    }

    setNumberPadHistory(newHistory);
  };

  const undoNumberPad = () => {
    if (numberPadHistoryIndex > 0) {
      const prevIndex = numberPadHistoryIndex - 1;
      const prevState = numberPadHistory[prevIndex];

      setCrossedDigits(prevState.crossedDigits.map((col) => [...col]));
      setRemainingDigits([...prevState.remainingDigits]);
      setNumberPadHistoryIndex(prevIndex);
    }
  };

  const redoNumberPad = () => {
    if (numberPadHistoryIndex < numberPadHistory.length - 1) {
      const nextIndex = numberPadHistoryIndex + 1;
      const nextState = numberPadHistory[nextIndex];

      setCrossedDigits(nextState.crossedDigits.map((col) => [...col]));
      setRemainingDigits([...nextState.remainingDigits]);
      setNumberPadHistoryIndex(nextIndex);
    }
  };

  const resetNumberPad = () => {
    saveNumberPadState();
    const newCrossed = Array(digitLength)
      .fill()
      .map(() => Array(10).fill(false));
    setCrossedDigits(newCrossed);
    setRemainingDigits(Array(digitLength).fill(""));
  };

  const addDigitToGuess = (digit) => {
    if (guess.length < digitLength) {
      setGuess(guess + digit.toString());
    }
  };

  const clearGuess = () => {
    setGuess("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setStatus(`Room ID ${roomId} copied to clipboard!`);
  };

  const handleExitGame = () => {
    setShowExitDialog(true);
  };

  const confirmExitGame = () => {
    socket.emit("exitGame", { roomId });
    setShowExitDialog(false);
    resetGame();
  };

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
    setCrossedDigits(
      Array(digitLength)
        .fill()
        .map(() => Array(10).fill(false))
    );
    setRemainingDigits(Array(digitLength).fill(""));
    setNumberPadHistory([]);
    setNumberPadHistoryIndex(-1);
  };

  const handleDialogClose = () => {
    setShowWinDialog(false);
    resetGame();
  };

  const NumberTrackerHelper = () => (
    <Card elevation={2} sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          🎯 Number Tracker Helper
        </Typography>

        {/* Top row showing remaining possibilities */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2, gap: 1 }}>
          {Array.from({ length: digitLength }, (_, colIndex) => (
            <Paper
              key={colIndex}
              elevation={3}
              sx={{
                width: 55,
                height: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: remainingDigits[colIndex]
                  ? "success.main"
                  : "grey.100",
                border: "3px solid",
                borderColor: remainingDigits[colIndex]
                  ? "success.dark"
                  : "grey.400",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color={remainingDigits[colIndex] ? "white" : "text.secondary"}
              >
                {remainingDigits[colIndex] || "?"}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Column headers */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1, gap: 1 }}>
          {Array.from({ length: digitLength }, (_, colIndex) => (
            <Paper
              key={colIndex}
              sx={{
                width: 55,
                height: 25,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" color="white" fontWeight="bold">
                Pos {colIndex + 1}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Number grid - each row represents a digit (0-9) */}
        <Box sx={{ bgcolor: "grey.50", p: 1, borderRadius: 2 }}>
          {Array.from({ length: 10 }, (_, digit) => (
            <Box
              key={digit}
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 0.5,
                gap: 1,
              }}
            >
              {Array.from({ length: digitLength }, (_, colIndex) => (
                <Button
                  key={`${digit}-${colIndex}`}
                  variant={
                    crossedDigits[colIndex][digit] ? "outlined" : "contained"
                  }
                  color={crossedDigits[colIndex][digit] ? "error" : "primary"}
                  size="small"
                  sx={{
                    width: 55,
                    height: 35,
                    minWidth: 55,
                    position: "relative",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "&::after": crossedDigits[colIndex][digit]
                      ? {
                          content: '"✕"',
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "1.2rem",
                          color: "error.main",
                          fontWeight: "bold",
                        }
                      : {},
                  }}
                  onClick={() => toggleDigitCross(colIndex, digit)}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{
                      opacity: crossedDigits[colIndex][digit] ? 0.3 : 1,
                    }}
                  >
                    {digit}
                  </Typography>
                </Button>
              ))}
            </Box>
          ))}
        </Box>

        {/* Control buttons */}
        <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            onClick={resetNumberPad}
            color="warning"
            sx={{ flex: 1, minWidth: "120px" }}
          >
            🔄 Reset Tracker
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={undoNumberPad}
            disabled={numberPadHistoryIndex <= 0}
            sx={{ flex: 1, minWidth: "80px" }}
          >
            ↶ Undo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={redoNumberPad}
            disabled={numberPadHistoryIndex >= numberPadHistory.length - 1}
            sx={{ flex: 1, minWidth: "80px" }}
          >
            ↷ Redo
          </Button>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "info.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "info.200",
          }}
        >
          <Typography variant="body2" color="info.main">
            <strong>💡 How to use:</strong>
            <br />
            • Click any digit to cross it out for that position
            <br />
            • When only one digit remains uncrossed in a column, it auto-fills
            above
            <br />
            • Use undo/redo to navigate your tracking history
            <br />• Reset clears all crosses to start fresh
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickNumberInput = () => (
    <Card elevation={1} sx={{ mt: 2 }}>
      <CardContent sx={{ pt: 2, pb: 2 }}>
        <Typography variant="subtitle1" gutterBottom color="secondary">
          ⚡ Quick Number Input
        </Typography>
        <Grid container spacing={1}>
          {Array.from({ length: 10 }, (_, digit) => (
            <Grid item xs={2.4} key={digit}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => addDigitToGuess(digit)}
                disabled={guess.length >= digitLength || !isMyTurn}
                sx={{
                  minHeight: 40,
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {digit}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={clearGuess}
          disabled={!guess}
          sx={{ mt: 1 }}
        >
          Clear Guess
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          🎯 Guess The Number
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          A multiplayer number guessing game with turns
        </Typography>
      </Paper>

      {/* Progress Stepper */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Turn Indicator */}
      {activeStep === 2 && (
        <Paper
          elevation={2}
          sx={{ p: 2, mb: 3, bgcolor: isMyTurn ? "success.50" : "warning.50" }}
        >
          <Typography
            variant="body1"
            align="center"
            color={isMyTurn ? "success.main" : "warning.main"}
            fontWeight="bold"
          >
            {isMyTurn
              ? "🎯 Your Turn!"
              : `⏳ ${currentTurn || "Opponent"}'s Turn`}
          </Typography>
        </Paper>
      )}

      {/* Status Display */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: "primary.50" }}>
        <Typography
          variant="body1"
          align="center"
          color="primary.main"
          fontWeight="medium"
        >
          📊 Status: {status}
        </Typography>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Step 0: Create/Join Room */}
      {activeStep === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  🆕 Create Room
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField
                    label="Your Name"
                    variant="outlined"
                    fullWidth
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Digit Length"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={digitLength}
                    onChange={(e) => setDigitLength(Number(e.target.value))}
                    inputProps={{ min: 3, max: 7 }}
                    helperText="Choose between 3-7 digits"
                    disabled={isLoading}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? "Creating..." : "Create Room"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="secondary"
                >
                  🚪 Join Room
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  component="form"
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <TextField
                    label="Room ID"
                    variant="outlined"
                    fullWidth
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    disabled={isLoading}
                  />
                  <TextField
                    label="Your Name"
                    variant="outlined"
                    fullWidth
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    fullWidth
                    onClick={handleJoinRoom}
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? "Joining..." : "Join Room"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Step 1: Submit Secret */}
      {activeStep === 1 && (
        <Card elevation={3}>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              color="primary"
            >
              🔐 Set Your Secret Number
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {roomId && (
              <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "success.50" }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1" color="success.main">
                    <strong>Room ID:</strong> {roomId}
                  </Typography>
                  <IconButton onClick={copyRoomId} color="success">
                    <CopyIcon />
                  </IconButton>
                </Box>
              </Paper>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <TextField
                label={`Secret Number (${digitLength} digits)`}
                variant="outlined"
                fullWidth
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                inputProps={{ maxLength: digitLength }}
                helperText={`Enter a ${digitLength}-digit number (duplicates allowed)`}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowSecret(!showSecret)}>
                      {showSecret ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSecretSubmit}
                sx={{ py: 1.5 }}
              >
                Submit Secret
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Guessing */}
      {activeStep === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  🎯 Make Your Guess
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label={`Your Guess (${digitLength} digits)`}
                    variant="outlined"
                    fullWidth
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    inputProps={{ maxLength: digitLength }}
                    onKeyPress={(e) => e.key === "Enter" && handleGuess()}
                    disabled={!isMyTurn}
                    helperText={
                      isMyTurn ? "Enter your guess" : "Wait for your turn"
                    }
                    sx={{ fontSize: "1.2rem" }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleGuess}
                    disabled={!isMyTurn}
                    sx={{ py: 1.5 }}
                  >
                    Submit Guess
                  </Button>
                </Box>

                <QuickNumberInput />
                <NumberTrackerHelper />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="secondary"
                >
                  📈 Guess History
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {guessHistory.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ py: 2 }}
                  >
                    No guesses yet. Game will start soon!
                  </Typography>
                ) : (
                  <List sx={{ maxHeight: 400, overflow: "auto" }}>
                    {guessHistory.map((entry, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography
                                  variant="h6"
                                  component="span"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  {entry.guess}
                                </Typography>
                                <Chip
                                  label={
                                    entry.player === playerName
                                      ? "You"
                                      : "Opponent"
                                  }
                                  color={
                                    entry.player === playerName
                                      ? "primary"
                                      : "secondary"
                                  }
                                  size="small"
                                />
                              </Box>
                              <Chip
                                label={`${entry.correct} correct`}
                                color={
                                  entry.correct === digitLength
                                    ? "success"
                                    : "default"
                                }
                                size="small"
                              />
                            </Box>
                          }
                          secondary={`${entry.correct} digit(s) in correct position`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Exit Game Button */}
      {activeStep > 0 && (
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

      {/* Win/Loss Dialog */}
      <Dialog open={showWinDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {gameWinner === playerName || gameWinner === "You"
            ? "🎉 Congratulations!"
            : "😔 Game Over"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {gameWinner === playerName || gameWinner === "You"
              ? "You successfully guessed the secret number!"
              : "Better luck next time!"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained">
            Play Again
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Exit Game?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to exit? Your opponent will win by default.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Cancel</Button>
          <Button onClick={confirmExitGame} color="error" variant="contained">
            Exit Game
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
