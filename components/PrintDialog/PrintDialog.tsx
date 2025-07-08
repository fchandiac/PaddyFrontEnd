import React, { useRef } from "react";
import { Dialog, Box, Typography, Button, IconButton, Tooltip } from "@mui/material";
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { useReactToPrint } from "react-to-print";
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface PrintDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  dialogWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  pageStyle?: string; // Estilo de la página de impresión
  receptionData?: {
    id?: number;
    producerRut?: string;
    producerName?: string;
  };
}

export default function PrintDialog({
  open,
  setOpen,
  title,
  children,
  dialogWidth = "md",
  receptionData,
}: PrintDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef, // ✅ nuevo uso recomendado por la documentación oficial
    documentTitle: title,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadPDF = () => {
    if (contentRef.current) {
      // Generar el nombre del archivo según el patrón solicitado
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
      
      let fileName = `recepcion`;
      
      // Añadir ID de recepción si está disponible
      if (receptionData?.id) {
        fileName += `-${receptionData.id}`;
      }
      
      // Añadir RUT del productor si está disponible
      if (receptionData?.producerRut) {
        fileName += `_${receptionData.producerRut.replace(/\./g, '').replace(/-/g, '')}`;
      }
      
      // Añadir nombre del productor si está disponible
      if (receptionData?.producerName) {
        // Limpiar el nombre para que sea válido como nombre de archivo
        const cleanName = receptionData.producerName
          .replace(/[^\w\s]/gi, '') // Eliminar caracteres especiales
          .replace(/\s+/g, '_');    // Reemplazar espacios con guiones bajos
        fileName += `_${cleanName}`;
      }
      
      // Añadir la fecha
      fileName += `_${formattedDate}`;
      
      // Configuración para html2pdf
      const opt = {
        margin: 10,
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Generar el PDF
      html2pdf().from(contentRef.current).set(opt).save();
    }
  };

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
          <Tooltip title="Descargar PDF">
            <IconButton 
              onClick={handleDownloadPDF}
              color="primary"
              sx={{ mr: 1 }}
            >
              <PictureAsPdfOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => handlePrint?.()}
            sx={{ mr: 1 }}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            Cerrar
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
