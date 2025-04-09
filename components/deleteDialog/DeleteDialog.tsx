"use client";

import {
  Dialog,
  Button,
  Grid,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

interface DeleteDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
  submit: () => Promise<void>; // función async para eliminar
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  message,
  onClose,
  submit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null); // limpiamos errores previos
    try {
      setLoading(true);
      await submit();
      onClose(); // cerramos el diálogo si todo va bien
    } catch (err) {
      setError("Ocurrió un error al eliminar. Intenta nuevamente.");
      console.error("Error al eliminar:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ padding: 2, minWidth: 300 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Alert severity="warning">{message}</Alert>
          </Grid>

          {error && (
            <Grid item>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item textAlign="right">
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};
