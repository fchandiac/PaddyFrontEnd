"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  MenuItem,
  List,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import packageJson from "../../package.json";

const AppName = "Paddy AyG";
const AppVersion = `v${packageJson.version}`;

interface SideBarProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}

export default function SideBar({ open, toggleDrawer }: SideBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    toggleDrawer(false); // cierra el drawer
    
    console.log('Cerrando sesión...');
    
    try {
      // Cerrar sesión de NextAuth
      await signOut({
        callbackUrl: "/",
        redirect: true
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // En caso de error, forzar redirección
      window.location.href = "/";
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
      <Box sx={{ width: 250, padding: 2, position: 'relative', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Image 
            src="/logo.svg" 
            alt="Paddy AyG Logo" 
            width={100} 
            height={100} 
            priority 
          />
          <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            {AppName}
          </Typography>
          <Typography
            variant="caption"
            align="center"
            color="textSecondary"
            sx={{ fontSize: '0.7rem' }}
          >
            {AppVersion}
          </Typography>
        </Box>

        <List>
          <MenuItem
            onClick={() => {
              router.push("/paddy");
              toggleDrawer(false);
            }}
          >
            Dashboard
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/paddy/receptions/receptions");
              toggleDrawer(false);
            }}
          >
            Recepciones
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/paddy/producers/producers");
              toggleDrawer(false);
            }}
          >
            Productores
          </MenuItem>

          {/* <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Menú
          </MenuItem>
 */}
          {/* <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Menú
          </MenuItem> */}

          {/* <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Menú
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              router.push("/paddy/users");
              toggleDrawer(false);
            }}
          >
            Usuarios
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/paddy/records");
              toggleDrawer(false);
            }}
          >
            Registros
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/paddy/settlements");
              toggleDrawer(false);
            }}
          >
            Liquidaciones
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </List>

        {/* Información de la empresa */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 400,
              color: '#666666',
              fontSize: '0.65rem',
              display: 'block',
              mb: 0.2,
            }}
          >
            Soc. Comercial e Industrial
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: '#1976d2',
              fontSize: '0.75rem',
              display: 'block',
              mb: 0.5,
            }}
          >
            Aparicio y García Ltda.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#888888',
              fontSize: '0.65rem',
              fontStyle: 'italic',
            }}
          >
            Sistema Integral para la Gestión de Paddy
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
