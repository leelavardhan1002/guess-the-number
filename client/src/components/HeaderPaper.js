import React from "react";
import { Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const HeaderPaper = () => (
  <MotionPaper
    elevation={6}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    sx={{
      p: 4,
      mb: 4,
      textAlign: "center",
      borderRadius: 4,
      background:
        "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #9d174d 100%)",
      color: "white",
      boxShadow: "0 12px 24px rgba(236, 72, 153, 0.3)",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
        pointerEvents: "none",
      },
    }}
  >
    <Typography
      variant="h3"
      component="h1"
      gutterBottom
      sx={{
        fontWeight: 700,
        textShadow: "0 2px 4px rgba(0,0,0,0.2)",
        position: "relative",
        zIndex: 1,
      }}
    >
      🎯 Guess The Number
    </Typography>
    <Typography
      variant="h6"
      sx={{
        opacity: 0.95,
        fontWeight: 400,
        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
        position: "relative",
        zIndex: 1,
      }}
    >
      A multiplayer number guessing game with turns
    </Typography>
  </MotionPaper>
);

export default HeaderPaper;
