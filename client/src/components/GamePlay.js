import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import HeartDigitGrid from "./HeartDigitGrid";

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

// Sub-components for better organization
const QuickNumberInput = ({
  onAddDigit,
  onClearGuess,
  guess,
  digitLength,
  isMyTurn,
}) => (
  <MotionCard
    elevation={2}
    sx={{
      mt: 2,
      p: 2,
      bgcolor: "#fdf2f8",
      borderRadius: 2,
      border: "1px solid #f9a8d4",
    }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
  >
    <CardContent sx={{ pt: 2, pb: "16px !important" }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "#be185d", fontWeight: 600 }}
      >
        ⚡ Quick Number Input
      </Typography>
      <Grid container spacing={1}>
        {Array.from({ length: 10 }, (_, digit) => (
          <Grid item xs={2.4} key={digit}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={() => onAddDigit(digit)}
              disabled={guess.length >= digitLength || !isMyTurn}
              sx={{
                width: 50,
                height: 50,
                minWidth: 50,
                fontSize: "1rem",
                fontWeight: "bold",
                borderColor: "#f9a8d4",
                borderRadius: "50%",
                color: "#be185d",
                "&:hover": {
                  borderColor: "#ec4899",
                  backgroundColor: "rgba(236, 72, 153, 0.05)",
                },
                "&:disabled": {
                  borderColor: "#e5e7eb",
                  color: "#9ca3af",
                },
              }}
            >
              {digit}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={onClearGuess}
          disabled={!guess}
          sx={{
            mt: 2,
            borderColor: "#f9a8d4",
            color: "#be185d",
            padding: "0.5rem",
            "&:hover": {
              borderColor: "#ec4899",
              backgroundColor: "rgba(236, 72, 153, 0.05)",
            },
            "&:disabled": {
              borderColor: "#e5e7eb",
              color: "#9ca3af",
            },
          }}
        >
          Clear Guess
        </Button>
      </Box>
    </CardContent>
  </MotionCard>
);

const NumberTrackerHelper = ({
  digitLength,
  crossedDigits,
  remainingDigits,
  onToggleDigitCross,
  onUndoNumberPad,
  onRedoNumberPad,
  onResetNumberPad,
  numberPadHistoryIndex,
  numberPadHistoryLength,
}) => (
  <MotionCard
    elevation={3}
    sx={{
      mt: 2,
      p: 2,
      bgcolor: "#fdf2f8",
      borderRadius: 2,
      border: "1px solid #f9a8d4",
      boxShadow: "unset",
    }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <CardContent>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: "#be185d", fontWeight: 600 }}
      >
        🎯 Number Tracker Helper
      </Typography>

      {/* Top row showing remaining possibilities */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2, gap: 1 }}>
        {Array.from({ length: digitLength }, (_, colIndex) => {
          const isActive = !!remainingDigits[colIndex];
          return (
            <Box
              key={colIndex}
              sx={{
                width: 55,
                height: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isActive
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #e5e7eb, #f3f4f6)",
                color: isActive ? "white" : "#6b7280",
                border: "2px solid",
                borderColor: isActive ? "#047857" : "#d1d5db",
                transition: "all 0.3s ease",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {remainingDigits[colIndex] || "?"}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Column headers */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1, gap: 1 }}>
        {Array.from({ length: digitLength }, (_, colIndex) => (
          <Paper
            key={colIndex}
            sx={{
              width: 59,
              height: 25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#ec4899",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="white" fontWeight="bold">
              Pos {colIndex + 1}
            </Typography>
          </Paper>
        ))}
      </Box>

      <HeartDigitGrid
        digitLength={digitLength}
        crossedDigits={crossedDigits}
        onToggleDigitCross={onToggleDigitCross}
      />

      {/* Control buttons */}
      <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          size="small"
          onClick={onResetNumberPad}
          sx={{
            flex: 1,
            minWidth: "120px",
            borderColor: "#f59e0b",
            color: "#f59e0b",
            "&:hover": {
              borderColor: "#d97706",
              backgroundColor: "rgba(245, 158, 11, 0.05)",
            },
          }}
        >
          🔄 Reset Tracker
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onUndoNumberPad}
          disabled={numberPadHistoryIndex <= 0}
          sx={{
            flex: 1,
            minWidth: "80px",
            borderColor: "#f9a8d4",
            color: "#be185d",
            "&:hover": {
              borderColor: "#ec4899",
              backgroundColor: "rgba(236, 72, 153, 0.05)",
            },
            "&:disabled": {
              borderColor: "#e5e7eb",
              color: "#9ca3af",
            },
          }}
        >
          ↶ Undo
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onRedoNumberPad}
          disabled={numberPadHistoryIndex >= numberPadHistoryLength - 1}
          sx={{
            flex: 1,
            minWidth: "80px",
            borderColor: "#f9a8d4",
            color: "#be185d",
            "&:hover": {
              borderColor: "#ec4899",
              backgroundColor: "rgba(236, 72, 153, 0.05)",
            },
            "&:disabled": {
              borderColor: "#e5e7eb",
              color: "#9ca3af",
            },
          }}
        >
          ↷ Redo
        </Button>
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 2,
          bgcolor: "#fdf2f8",
          borderRadius: 2,
          border: "1px solid #f9a8d4",
        }}
      >
        <Typography variant="body2" sx={{ color: "#be185d" }}>
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
  </MotionCard>
);

const GuessHistory = ({ guessHistory, playerName, digitLength }) => (
  <MotionCard
    elevation={6}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    sx={{
      borderRadius: 4,
      background: "linear-gradient(145deg, #ffeef7, #fff5f8)",
      boxShadow: "0 10px 20px rgba(236, 72, 153, 0.15)",
    }}
  >
    <CardContent>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ color: "#be185d", fontWeight: 600 }}
      >
        📈 Guess History
      </Typography>
      <Divider sx={{ mb: 2, borderColor: "#f9a8d4" }} />
      {guessHistory.length === 0 ? (
        <Typography
          variant="body2"
          color="#6b7280"
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
                        sx={{ fontFamily: "monospace", color: "#374151" }}
                      >
                        {entry.guess}
                      </Typography>
                      <Chip
                        label={entry.player === playerName ? "You" : "Opponent"}
                        sx={{
                          backgroundColor:
                            entry.player === playerName ? "#ec4899" : "#6b7280",
                          color: "white",
                          fontWeight: 500,
                        }}
                        size="small"
                      />
                    </Box>
                    <Chip
                      label={`${entry.correct} correct`}
                      sx={{
                        backgroundColor:
                          entry.correct === digitLength ? "#059669" : "#6b7280",
                        color: "white",
                        fontWeight: 500,
                      }}
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
  </MotionCard>
);

const GamePlay = ({
  guess,
  setGuess,
  digitLength,
  isMyTurn,
  guessHistory,
  playerName,
  onGuess,
  onAddDigit,
  onClearGuess,
  crossedDigits,
  remainingDigits,
  onToggleDigitCross,
  onUndoNumberPad,
  onRedoNumberPad,
  onResetNumberPad,
  numberPadHistoryIndex,
  numberPadHistoryLength,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "2rem",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <MotionCard
          elevation={6}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffeef7, #fff5f8)",
            boxShadow: "0 10px 20px rgba(236, 72, 153, 0.15)",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ color: "#be185d", fontWeight: 600 }}
            >
              🎯 Make Your Guess
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "#f9a8d4" }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label={`Your Guess (${digitLength} digits)`}
                variant="outlined"
                fullWidth
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                inputProps={{ maxLength: digitLength }}
                onKeyPress={(e) => e.key === "Enter" && onGuess()}
                disabled={!isMyTurn}
                helperText={
                  isMyTurn ? "Enter your guess" : "Wait for your turn"
                }
                sx={{
                  fontSize: "1.2rem",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ec4899",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#be185d",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#9ca3af",
                    "&.Mui-focused": {
                      color: "#be185d",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#6b7280",
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={onGuess}
                disabled={!isMyTurn}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #ec4899, #be185d)",
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #be185d, #9d174d)",
                    boxShadow: "0 6px 16px rgba(236, 72, 153, 0.4)",
                  },
                  "&:disabled": {
                    background: "#d1d5db",
                    color: "#9ca3af",
                    boxShadow: "none",
                  },
                }}
              >
                🎯 Submit Guess
              </Button>
            </Box>

            <QuickNumberInput
              onAddDigit={onAddDigit}
              onClearGuess={onClearGuess}
              guess={guess}
              digitLength={digitLength}
              isMyTurn={isMyTurn}
            />

            <NumberTrackerHelper
              digitLength={digitLength}
              crossedDigits={crossedDigits}
              remainingDigits={remainingDigits}
              onToggleDigitCross={onToggleDigitCross}
              onUndoNumberPad={onUndoNumberPad}
              onRedoNumberPad={onRedoNumberPad}
              onResetNumberPad={onResetNumberPad}
              numberPadHistoryIndex={numberPadHistoryIndex}
              numberPadHistoryLength={numberPadHistoryLength}
            />
          </CardContent>
        </MotionCard>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: "350px",
        }}
      >
        <GuessHistory
          guessHistory={guessHistory}
          playerName={playerName}
          digitLength={digitLength}
        />
      </Box>
    </Box>
  );
};

export default GamePlay;
