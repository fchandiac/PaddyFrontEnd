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

const AppName = "App Name";
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

        <List>
          <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Dashboard
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Menú
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Menú
          </MenuItem>

          <MenuItem
            onClick={() => {
              router.push("/");
              toggleDrawer(false);
            }}
          >
            Menú
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout}>
            Cerrar sesión
          </MenuItem>
        </List>
      </Box>
    </Drawer>
  );
}
