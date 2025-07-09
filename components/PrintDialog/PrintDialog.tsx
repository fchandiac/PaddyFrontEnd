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

// Estilos CSS para impresión y PDF
const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    
    .print-content {
      border-top: none !important;
      border: none !important;
      padding-top: 0 !important;
      margin-top: 30px !important; /* Añadir margen superior de 30px (aproximadamente 1cm) */
    }
  }
`;

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
    pageStyle: printStyles,
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownloadPDF = () => {
    if (contentRef.current) {
      // Diagnóstico: Verificar si el contenido existe
      console.log('DIAGNÓSTICO PDF - innerHTML:', contentRef.current.innerHTML);
      // Crear un iframe oculto
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '210mm'; // A4 width
      iframe.style.height = '297mm'; // A4 height
      document.body.appendChild(iframe);
      // Copiar los estilos globales y de MUI
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write('<!DOCTYPE html><html><head>');
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
          doc.write(node.outerHTML);
        });
        doc.write('</head><body>');
        // Clonar el contenido y agregar marginTop al primer div (Box)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentRef.current.innerHTML;
        const firstBox = tempDiv.querySelector('div');
        if (firstBox) {
          firstBox.style.marginTop = '30px';
        }
        doc.write(tempDiv.innerHTML);
        doc.write('</body></html>');
        doc.close();
        // Esperar a que los estilos se apliquen y luego generar el PDF
        setTimeout(() => {
          html2pdf().from(doc.body).set({
            margin: [0, 10, 10, 10],
            filename: 'recepcion.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          }).save().then(() => {
            document.body.removeChild(iframe);
          });
        }, 500); // 500ms para asegurar que los estilos se apliquen
      }
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
        <Typography variant="h6" gutterBottom className="no-print">
          {"Vista previa de impresión " + title}
        </Typography>

        {/* Contenido imprimible */}
        <Box
          ref={contentRef}
          sx={{
            borderTop: "1px solid #ccc",
            paddingTop: 2,
            '@media print': {
              marginTop: '30px',
              borderTop: 'none',
              paddingTop: 0
            }
          }}
          className="print-content"
        >
          {children}
        </Box>

        <Box textAlign="right" mt={2} className="no-print">
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
