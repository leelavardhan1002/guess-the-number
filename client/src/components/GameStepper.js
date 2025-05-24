import React from "react";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  stepConnectorClasses,
  styled,
  StepConnector,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { Favorite } from "@mui/icons-material";

// Custom connector with styling
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#ec4899",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#be185d",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "rgba(236, 72, 153, 0.4)",
    borderTopWidth: 3,
    borderRadius: 1,
    ...(theme.palette.mode === "dark" && {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const CustomStepIcon = ({ active, completed, icon }) => (
  <Box
    sx={{
      position: "relative",
      color: completed
        ? "#be185d"
        : active
        ? "#ec4899"
        : "rgba(236, 72, 153, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Favorite fontSize="medium" />
    <Typography
      variant="caption"
      sx={{
        position: "absolute",
        bottom: "3px",
        fontSize: 10,
        color: "#fff",
        fontWeight: 600,
      }}
    >
      {icon}
    </Typography>
  </Box>
);

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const GameStepper = ({ activeStep, steps }) => (
  <Box sx={{ position: "relative", overflow: "hidden", mb: 3 }}>
    <MotionBox
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
      sx={{
        position: "absolute",
        top: -10,
        left: -10,
        fontSize: 100,
        color: "#f9a8d4",
        opacity: 0.4,
        zIndex: 2,
      }}
    >
      💗
    </MotionBox>
    <MotionBox
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity }}
      sx={{
        position: "absolute",
        bottom: -20,
        right: -10,
        fontSize: 120,
        color: "#f472b6",
        opacity: 0.3,
        zIndex: 2,
        transform: "rotate(-20deg)",
      }}
    >
      💖
    </MotionBox>

    {/* Animated paper wrapper */}
    <MotionPaper
      elevation={3}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      sx={{
        p: 3,
        borderRadius: 3,
        background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
        border: "1px solid #f9a8d4",
        boxShadow: "0 4px 12px rgba(236, 72, 153, 0.1)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Stepper
        activeStep={activeStep}
        connector={<QontoConnector />}
        alternativeLabel
        sx={{
          "& .MuiStepLabel-root .Mui-completed": { color: "#be185d" },
          "& .MuiStepLabel-root .Mui-active": { color: "#ec4899" },
          "& .MuiStepLabel-root .MuiStepLabel-label": {
            color: "#6b7280",
            "&.Mui-active": { color: "#be185d", fontWeight: 600 },
            "&.Mui-completed": { color: "#9d174d", fontWeight: 500 },
          },
          "& .MuiStepIcon-root": {
            color: "rgba(236, 72, 153, 0.4)",
            "&.Mui-active": { color: "#ec4899" },
            "&.Mui-completed": { color: "#be185d" },
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </MotionPaper>
  </Box>
);

export default GameStepper;
