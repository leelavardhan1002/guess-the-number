import React from "react";
import { Alert } from "@mui/material";

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mb: 3 }} onClose={onClose}>
      {error}
    </Alert>
  );
};

export default ErrorAlert;
