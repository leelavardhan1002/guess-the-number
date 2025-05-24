import React from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const CreateRoomCard = ({
  playerName,
  setPlayerName,
  digitLength,
  setDigitLength,
  isLoading,
  onCreateRoom,
}) => {
  return (
    <MotionCard
      elevation={6}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        borderRadius: 4,
        background: "linear-gradient(145deg, #ffeef7, #fff5f8)",
        boxShadow: "0 10px 20px rgba(236, 72, 153, 0.15)",
        px: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#be185d",
            fontWeight: 600,
          }}
        >
          <FavoriteIcon sx={{ color: "#ec4899" }} /> Create Room
        </Typography>
        <Divider sx={{ mb: 2, borderColor: "#f9a8d4" }} />
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Your Lovely Name 💖"
            variant="outlined"
            fullWidth
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={isLoading}
            sx={{
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
            }}
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
            sx={{
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
            onClick={onCreateRoom}
            disabled={isLoading}
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
            {isLoading ? "Creating..." : "💌 Create Room"}
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default CreateRoomCard;
