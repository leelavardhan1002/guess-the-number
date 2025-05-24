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
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const JoinRoomCard = ({
  roomId,
  setRoomId,
  playerName,
  setPlayerName,
  isLoading,
  onJoinRoom,
}) => (
  <MotionCard
    elevation={6}
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
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
          color: "#be185d",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        💝 Join Room
      </Typography>
      <Divider sx={{ mb: 2, borderColor: "#f9a8d4" }} />
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
          label="Your Lovely Name 💖"
          variant="outlined"
          fullWidth
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          disabled={isLoading}
          helperText=" "
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
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onJoinRoom}
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
          {isLoading ? "Joining..." : "👻 Join Room"}
        </Button>
      </Box>
    </CardContent>
  </MotionCard>
);

export default JoinRoomCard;
