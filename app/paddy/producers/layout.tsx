"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, Tab, Box, Container } from "@mui/material";

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Definir pestañas y rutas
  const tabs = [
    { label: "Productores", path: "/paddy/producers/producers" },
    { label: "Cuentas", path: "/paddy/producers/accounts" },
  
  ];

  // Determinar qué pestaña está activa
  const currentTab = tabs.findIndex((tab) => pathname === tab.path);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].path); // Cambiar la ruta al hacer clic en una pestaña
  };

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        aria-label="Product Tabs"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          paddingX: 2,
          position: "sticky",
          top: 60,
          zIndex: 1000, // Asegurar que la barra esté por encima de otros elementos
          bgcolor: "background.paper", // Fondo para que no sea transparente
          boxShadow: 1, // Opcional: sombra para resaltar la barra
        }}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

  
       {children}
   
    </>
  );
}
