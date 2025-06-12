import React, { useRef } from "react";
import { Dialog, Box, Typography, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";

interface PrintDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  dialogWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  pageStyle?: string; // Estilo de la página de impresión
}

export default function PrintDialog({
  open,
  setOpen,
  title,
  children,
  dialogWidth = "md",
}: PrintDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef, // ✅ nuevo uso recomendado por la documentación oficial
    documentTitle: title,
  });

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={dialogWidth}
      onClose={() => setOpen(false)}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          {"Vista previa de impresión " + title}
        </Typography>

        {/* Contenido imprimible */}
        <Box
          ref={contentRef}
          sx={{
            borderTop: "1px solid #ccc",
            paddingTop: 2,
          }}
        >
          {children}
        </Box>

        <Box textAlign="right" mt={2}>
          <Button
            variant="contained"
            onClick={() => handlePrint?.()}
            sx={{ mr: 1 }}
          >
            Imprimir
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
