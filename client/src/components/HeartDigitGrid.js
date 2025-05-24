import React from "react";
import { Box, Button, Typography } from "@mui/material";

const HeartDigitGrid = ({ digitLength, crossedDigits, onToggleDigitCross }) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#fdf2f8",
        borderRadius: 2,
        border: "1px solid #f9a8d4",
      }}
    >
      {Array.from({ length: 10 }, (_, digit) => (
        <Box
          key={digit}
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1,
            gap: 1.5,
          }}
        >
          {Array.from({ length: digitLength }, (_, colIndex) => {
            const isCrossed = crossedDigits[colIndex]?.[digit];

            return (
              <Button
                key={`${digit}-${colIndex}`}
                onClick={() => onToggleDigitCross(colIndex, digit)}
                sx={{
                  width: 50,
                  height: 50,
                  minWidth: 50,
                  backgroundColor: isCrossed ? "transparent" : "#ec4899",
                  border: `2px solid ${isCrossed ? "#dc2626" : "#ec4899"}`,
                  borderRadius: "50%",
                  color: isCrossed ? "#dc2626" : "#fff",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  position: "relative",
                  padding: 0,
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                  "&:hover": {
                    backgroundColor: isCrossed
                      ? "rgba(220, 38, 38, 0.05)"
                      : "#be185d",
                    borderColor: isCrossed ? "#dc2626" : "#be185d",
                    transform: "scale(1.1)",
                  },
                  "&::after": isCrossed
                    ? {
                        content: '"✕"',
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "1.4rem",
                        fontWeight: "bold",
                        color: "#dc2626",
                        zIndex: 2,
                      }
                    : {},
                }}
              >
                <Typography
                  sx={{
                    opacity: isCrossed ? 0.15 : 1,
                    zIndex: 1,
                  }}
                >
                  {digit}
                </Typography>
              </Button>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default HeartDigitGrid;
