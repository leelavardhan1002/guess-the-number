import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const SecretSubmission = ({
  roomId,
  secret,
  setSecret,
  digitLength,
  onSubmit,
  onCopyRoomId,
}) => {
  const [showSecret, setShowSecret] = useState(false);

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
            color: "#be185d",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🔐 Set Your Secret Number
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "#f9a8d4" }} />

        {roomId && (
          <MotionPaper
            elevation={2}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
              border: "1px solid #86efac",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#059669",
                  fontWeight: 600,
                }}
              >
                <strong>Room ID:</strong> {roomId}
              </Typography>
              <IconButton
                onClick={onCopyRoomId}
                sx={{
                  color: "#059669",
                  "&:hover": {
                    backgroundColor: "rgba(5, 150, 105, 0.1)",
                  },
                }}
              >
                <CopyIcon />
              </IconButton>
            </Box>
          </MotionPaper>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <TextField
            label={`Secret Number (${digitLength} digits)`}
            variant="outlined"
            fullWidth
            type={showSecret ? "text" : "password"}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            inputProps={{ maxLength: digitLength }}
            helperText={`Enter a ${digitLength}-digit number (duplicates allowed)`}
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
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowSecret(!showSecret)}
                  sx={{
                    color: "#9ca3af",
                    "&:hover": {
                      color: "#ec4899",
                      backgroundColor: "rgba(236, 72, 153, 0.1)",
                    },
                  }}
                >
                  {showSecret ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onSubmit}
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
            🔒 Submit Secret
          </Button>
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default SecretSubmission;
