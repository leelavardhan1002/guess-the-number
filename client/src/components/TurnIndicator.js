// components/TurnIndicator.js
import React from "react";
import { Paper, Typography } from "@mui/material";

const TurnIndicator = ({ isMyTurn, currentTurn }) => (
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
      {isMyTurn ? "🎯 Your Turn!" : `⏳ ${currentTurn || "Opponent"}'s Turn`}
    </Typography>
  </Paper>
);

export default TurnIndicator;
