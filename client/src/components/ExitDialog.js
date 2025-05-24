import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ExitDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Exit Game?</DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        Are you sure you want to exit? Your opponent will win by default.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Exit Game
      </Button>
    </DialogActions>
  </Dialog>
);

export default ExitDialog;
