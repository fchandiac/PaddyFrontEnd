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
      
      // Crear un clon del contenido para manipularlo antes de generar el PDF
      const contentClone = contentRef.current.cloneNode(true) as HTMLElement;
      
      // Eliminar explícitamente el borde superior y el padding en el clon
      contentClone.style.borderTop = 'none';
      contentClone.style.paddingTop = '0';
      contentClone.style.marginTop = '0';
      
      // Eliminar cualquier elemento con clase no-print del clon
      const elementsToRemove = contentClone.querySelectorAll('.no-print');
      elementsToRemove.forEach(el => el.parentNode?.removeChild(el));
      
      // Configuración para html2pdf
      const opt = {
        margin: [0, 10, 10, 10], // [top, right, bottom, left]
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          // Asegurar que no haya márgenes adicionales
          windowWidth: contentClone.scrollWidth,
          windowHeight: contentClone.scrollHeight
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Agregar el clon temporalmente al DOM para generar el PDF
      contentClone.style.position = 'absolute';
      contentClone.style.left = '-9999px';
      document.body.appendChild(contentClone);
      
      // Generar el PDF desde el clon
      html2pdf().from(contentClone).set(opt).save().then(() => {
        // Eliminar el clon después de generar el PDF
        document.body.removeChild(contentClone);
      });
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
