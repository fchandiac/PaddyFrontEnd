"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import SideBar from "./SideBar";
import { useSession } from "next-auth/react";

const AppName = "App Name";
const AppVersion = "v1.0.0";

const TopBar: React.FC = () => {
  const [openUserInfoDialog, setOpenUserInfoDialog] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);

  const { data: session, status } = useSession();

  const userName = session?.user?.name || "Invitado";

  const handleOpenDialog = () => {
    setOpenUserInfoDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenUserInfoDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Left Section */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            {AppName}
            <Typography variant="caption" ml={1}>
              {AppVersion}
            </Typography>
          </Typography>

          {/* Right Section */}
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            {userName}
          </Typography>
          <IconButton color="inherit" onClick={handleOpenDialog}>
            <PersonIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setOpenSideBar(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* User Info Dialog */}
      <Dialog open={openUserInfoDialog} onClose={handleCloseDialog}>
        <Box p={3}>
          <Typography variant="h6">Información de Usuario</Typography>
          <Typography mt={2}>
            Nombre: {session?.user?.name || "N/A"}
          </Typography>
          <Typography>Email: {session?.user?.email || "N/A"}</Typography>
        </Box>
      </Dialog>

      {/* SideBar */}
      <SideBar open={openSideBar} toggleDrawer={setOpenSideBar} />
    </Box>
  );
};

export default TopBar;
