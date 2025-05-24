import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const WinDialog = ({ open, gameWinner, playerName, onClose }) => (
  <Dialog open={open} onClose={onClose}>
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
      <Button onClick={onClose} variant="contained">
        Play Again
      </Button>
    </DialogActions>
  </Dialog>
);

export default WinDialog;
