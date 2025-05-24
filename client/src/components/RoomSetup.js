import React from "react";
import { Box, Grid } from "@mui/material";
import CreateRoomCard from "./CreateRoomCard";
import JoinRoomCard from "./JoinRoomCard";

const RoomSetup = ({
  playerName,
  setPlayerName,
  roomId,
  setRoomId,
  digitLength,
  setDigitLength,
  isLoading,
  onCreateRoom,
  onJoinRoom,
}) => (
  <Box sx={{display: 'flex', gap: '1rem'}}>
      <CreateRoomCard
        playerName={playerName}
        setPlayerName={setPlayerName}
        digitLength={digitLength}
        setDigitLength={setDigitLength}
        isLoading={isLoading}
        onCreateRoom={onCreateRoom}
      />
      <JoinRoomCard
        roomId={roomId}
        setRoomId={setRoomId}
        playerName={playerName}
        setPlayerName={setPlayerName}
        isLoading={isLoading}
        onJoinRoom={onJoinRoom}
      />
  </Box>
);

export default RoomSetup;
