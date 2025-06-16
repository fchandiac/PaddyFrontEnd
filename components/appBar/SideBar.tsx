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

const AppName = "Paddy AyG";
const AppVersion = "v1.0.0";

interface SideBarProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}

export default function SideBar({ open, toggleDrawer }: SideBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    toggleDrawer(false); // cierra el drawer
    await signOut({
      callbackUrl: "/", // redirige al login después de cerrar sesión
    });
  };

  return (
    <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
      <Box sx={{ width: 250, padding: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Image 
            src="/logo.svg" 
            alt="Paddy AyG Logo" 
            width={100} 
            height={100} 
            priority 
          />
          <Typography variant="h5" align="center" gutterBottom>
            {AppName}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="textSecondary"
            paragraph
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
      </Box>
    </Drawer>
  );
}
