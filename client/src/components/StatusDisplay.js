import React from "react";
import { Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const StatusDisplay = ({ status }) => (
  <MotionPaper
    elevation={3}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    sx={{
      p: 2.5,
      mb: 3,
      borderRadius: 3,
      background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
      border: "1px solid #f9a8d4",
      boxShadow: "0 4px 12px rgba(236, 72, 153, 0.1)",
    }}
  >
    <Typography
      variant="body1"
      align="center"
      sx={{
        color: "#be185d",
        fontWeight: 600,
        fontSize: "1.1rem",
      }}
    >
      📊 Status: {status}
    </Typography>
  </MotionPaper>
);

export default StatusDisplay;
