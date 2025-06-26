"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Credenciales incorrectas");
      } else {
        router.push("/paddy");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar el login con un pequeño delay para suavizar la transición
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Fade in={showLogin} timeout={1000}>
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2} columns={2} sx={{ width: "100%" }}>
            {/* Logo */}
            <Grid item xs={2} sx={{ mb: 4 }}>
              <Box
                component="img"
                src="/logo.svg"
                alt="Logo"
                sx={{ width: 180, display: "block", mx: "auto" }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                size="small"
                type="email"
                variant="outlined"
                required
                autoComplete="off"
              />
            </Grid>

            {/* Password */}
            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                size="small"
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Mostrar u ocultar contraseña"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Error message */}
            {error && (
              <Grid item xs={2}>
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              </Grid>
            )}

            {/* Botón Login */}
            <Grid item xs={2}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ height: 45 }}
              >
                {loading ? "Procesando..." : "Ingresar"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Fade>
  );
}
