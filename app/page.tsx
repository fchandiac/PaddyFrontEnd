"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Button,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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
        redirect: true,
        email, 
        password,
        callbackUrl: "/paddy",
      });


      console.log(result);

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

  return (
    <main style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
          }}
        >
          <Grid
            container
            spacing={1}
            direction="column"
            p={1}
            sx={{ width: "100%", maxWidth: 400 }}
          >
            <Grid item>
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                fullWidth
                required
                autoComplete="off"
              />
            </Grid>
            <Grid item>
              <TextField
                label="Contraseña"
                variant="outlined"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
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

            {error && (
              <Grid item>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{ height: 45 }}
              >
                Ingresar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </main>
  );
}
