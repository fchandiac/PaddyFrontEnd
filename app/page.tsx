"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  Typography,
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
      console.log("Intentando login con:", { email });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/paddy",
      });

      console.log("Resultado del login:", result);

      if (result?.error) {
        console.error("Error en login:", result.error);
        setError("Credenciales incorrectas");
      } else if (result?.url) {
        router.push(result.url);
      } else {
        router.push("/paddy");
      }
    } catch (err) {
      console.error("Error inesperado en login:", err);
      setError("Ocurrió un error inesperado. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Mostrar el login con un pequeño delay para suavizar la transición
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 300); // Aumentado a 300ms para mejor transición

    return () => clearTimeout(timer);
  }, []);

  // TEMPORAL: Redirección automática mientras no hay autenticación
  useEffect(() => {
    console.log('REDIRIGIENDO AUTOMÁTICAMENTE A /paddy');
    router.push("/paddy");
  }, [router]);

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
              <Box sx={{ width: 180, display: "block", mx: "auto" }}>
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={180}
                  height={120}
                  priority={true}
                />
              </Box>
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

            {/* Información de la empresa */}
            <Grid item xs={2} sx={{ mt: 3 }}>
              <Box textAlign="center">
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 400,
                    color: "#666666",
                    fontSize: "0.8rem",
                    display: "block",
                    mb: 0.3,
                  }}
                >
                  Soc. Comercial e Industrial
                </Typography>
                <Typography
                  variant="subtitle1"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: "#1976d2",
                    fontSize: "1rem",
                    mb: 1,
                  }}
                >
                  Aparicio y García Ltda.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#888888",
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Sistema Integral para la Gestión de Paddy
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#aaaaaa",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                  }}
                >
                  Paddy AyG - Versión 2.1.0
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Fade>
  );
}
