"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Divider,
  Dialog,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArticleIcon from "@mui/icons-material/Article";
import PrintIcon from "@mui/icons-material/Print";
import { useAlertContext } from "@/context/AlertContext";
import { createReception } from "@/app/actions/reception";
import ReceptionGeneralData from "./ui/ReceptionGeneralData";
import GrainAnalysis from "./ui/GrainAnalysis";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { CreateReceptionPayload } from "@/types/reception";
import { useUserContext } from "@/context/UserContext";
import { getDefaultTemplate } from "@/app/actions/discount-template";
import { TemplateType } from "@/types/discount-template";
import SelectTemplate from "./ui/template/SelectTemplate";
import TemplateComponent from "./ui/template/Template";
import ErrorSummary from "./ui/ErrorSummary";
import PrintDialog from "@/components/PrintDialog/PrintDialog";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import ReceptionToPrint from "../ReceptionToPrint";

export default function NewReceptionPage() {
  const { showAlert } = useAlertContext();
  const { data, liveClusters, setTemplate } = useReceptionContext();
  const { user } = useUserContext();
  const { handleKeyDown } = useKeyboardNavigation();

  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  // dialog state
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openSaveTemplateDialog, setOpenSaveTemplateDialog] = useState(false);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);

  // Función para detectar si hay errores de validación
  const hasValidationErrors = (): boolean => {
    const checkNodeErrors = (cluster: any): boolean => {
      return !!(
        (cluster.percent?.error && cluster.percent?.errorMessage) ||
        (cluster.tolerance?.error && cluster.tolerance?.errorMessage) ||
        (cluster.penalty?.error && cluster.penalty?.errorMessage) ||
        (cluster.range?.error && cluster.range?.errorMessage) ||
        (cluster.node?.error && cluster.node?.errorMessage)
      );
    };

    return Object.values(liveClusters).some(cluster => 
      cluster && typeof cluster === 'object' && checkNodeErrors(cluster)
    );
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoadingTemplate(true);
      const template = await getDefaultTemplate();
      if (template) {
        setTemplate(template);
      } else {
        showAlert("No se encontró la plantilla por defecto", "error");
      }
      setLoadingTemplate(false);
    };
    fetchTemplate();
  }, [setTemplate]);

  const handleSave = async () => {
    // Verificar si hay errores de validación antes de guardar
    if (hasValidationErrors()) {
      showAlert("Por favor, corrija los errores antes de guardar", "error");
      return;
    }

    // Verificar datos obligatorios
    if (!data.producerId) {
      showAlert("Seleccione un productor", "error");
      return;
    }

    if (!data.riceTypeId) {
      showAlert("Seleccione un tipo de arroz", "error");
      return;
    }

    try {
      setLoadingSave(true);

      // Construir el payload para la API
      const payload: CreateReceptionPayload = {
        producerId: data.producerId,
        riceTypeId: data.riceTypeId,
        discountTemplateId: data.template?.id,
        price: data.price || 0,
        guide: data.guide || "",
        licensePlate: data.licensePlate || "",
        
        // Pesos
        grossWeight: liveClusters.grossWeight.node ? liveClusters.grossWeight.node.value : 0,
        tare: liveClusters.tare.node ? liveClusters.tare.node.value : 0,
        netWeight: liveClusters.netWeight.node ? liveClusters.netWeight.node.value : 0,
        
        // Parámetros
        percentHumedad: liveClusters.Humedad.percent ? liveClusters.Humedad.percent.value : 0,
        toleranceHumedad: liveClusters.Humedad.tolerance ? liveClusters.Humedad.tolerance.value : 0,
        
        percentGranosVerdes: liveClusters.GranosVerdes.percent ? liveClusters.GranosVerdes.percent.value : 0,
        toleranceGranosVerdes: liveClusters.GranosVerdes.tolerance ? liveClusters.GranosVerdes.tolerance.value : 0,
        
        percentImpurezas: liveClusters.Impurezas.percent ? liveClusters.Impurezas.percent.value : 0,
        toleranceImpurezas: liveClusters.Impurezas.tolerance ? liveClusters.Impurezas.tolerance.value : 0,
        
        percentVano: liveClusters.Vano.percent ? liveClusters.Vano.percent.value : 0,
        toleranceVano: liveClusters.Vano.tolerance ? liveClusters.Vano.tolerance.value : 0,
        
        percentHualcacho: liveClusters.Hualcacho.percent ? liveClusters.Hualcacho.percent.value : 0,
        toleranceHualcacho: liveClusters.Hualcacho.tolerance ? liveClusters.Hualcacho.tolerance.value : 0,
        
        percentGranosManchados: liveClusters.GranosManchados.percent ? liveClusters.GranosManchados.percent.value : 0,
        toleranceGranosManchados: liveClusters.GranosManchados.tolerance ? liveClusters.GranosManchados.tolerance.value : 0,
        
        percentGranosPelados: liveClusters.GranosPelados.percent ? liveClusters.GranosPelados.percent.value : 0,
        toleranceGranosPelados: liveClusters.GranosPelados.tolerance ? liveClusters.GranosPelados.tolerance.value : 0,
        
        percentGranosYesosos: liveClusters.GranosYesosos.percent ? liveClusters.GranosYesosos.percent.value : 0,
        toleranceGranosYesosos: liveClusters.GranosYesosos.tolerance ? liveClusters.GranosYesosos.tolerance.value : 0,
        
        // Bonificación y secado
        toleranceBonificacion: liveClusters.Bonus.tolerance ? liveClusters.Bonus.tolerance.value : 0,
        percentSecado: liveClusters.Dry.percent ? liveClusters.Dry.percent.value : 0,
        
        // Total paddy neto
        totalToPay: liveClusters.totalPaddy.node ? liveClusters.totalPaddy.node.value : 0,
        
        // Nota/observación
        note: data.note || "",
        
        // Estado predeterminado
        status: "pending"
      };

      // Llamar a la API para crear la recepción
      const result = await createReception(payload);
      
      showAlert("Recepción guardada correctamente", "success");
      
      // Redirigir a la página de recepciones después de guardar
      window.location.href = "/paddy/receptions/receptions";
      
    } catch (error) {
      console.error("Error al guardar la recepción:", error);
      showAlert("Error al guardar la recepción. Intente nuevamente.", "error");
    } finally {
      setLoadingSave(false);
    }
  };

  const handlePrint = () => {
    setOpenPrintDialog(true);
  };

  return (
    <>
      <Box sx={{ p: 2 }} onKeyDown={handleKeyDown}>
        <Grid container spacing={2} sx={{ minWidth: 0 }}>
          {/* General Data */}
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Datos de la recepción</Typography>
            <ReceptionGeneralData />

            <Divider />
            
            {/* Error Summary - Solo visible cuando hay errores */}
            {hasValidationErrors() && (
              <>
                <Typography gutterBottom sx={{ textAlign: 'right' }}>Errores de validación</Typography>
                <ErrorSummary />
              </>
            )}
          </Grid>

          {/* Grain Analysis */}
          <Grid item xs={12} md={6.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom>Análisis de granos</Typography>
              <Typography gutterBottom>
                Plantilla: {data.template.name}
              </Typography>
            </Box>

            <GrainAnalysis
            // template={data.template}
            // loadingTemplate={loadingTemplate}
            />
          </Grid>

          {/* Summary & Actions */}
          <Grid item xs={12} md={2.5}>
            <Typography gutterBottom>Totales</Typography>

            {/* Box resumen con borde redondeado y valores */}
            <Box
              sx={{
                border: "1px solid #1976d2",
                borderRadius: 2,
                p: 2,
                mb: 2,
                background: "#f7fafd",
                overflow: "auto",
                minWidth: 0,
              }}
            >
              <Box component="dl" sx={{ m: 0 }}>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Peso Bruto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.grossWeight.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.grossWeight.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Tara</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.tare.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.tare.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Peso Neto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.netWeight.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.netWeight.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Total Descuentos</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.DiscountTotal.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.DiscountTotal.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Bonificación</Box>
                  <Box component="dd">
                    {liveClusters.Bonus.penalty && !isNaN(liveClusters.Bonus.penalty.value)
                      ? `${liveClusters.Bonus.penalty.value} kg`
                      : "0 kg"}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Paddy Neto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.totalPaddy.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.totalPaddy.node.value} kg`}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton
                color="primary"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.dark',
                  },
                }}
                onClick={handlePrint}
              >
                <PrintIcon />
              </IconButton>
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                disabled={loadingSave || hasValidationErrors()}
              >
                {loadingSave ? (
                  <CircularProgress size={24} />
                ) : (
                  "Guardar recepción"
                )}
              </Button>
            </Stack>            <Divider />
            <Typography gutterBottom sx={{ textAlign: 'right' }}>Plantillas</Typography>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
              <IconButton
                color="primary"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.dark',
                  },
                }}
                onClick={() => {
                  setOpenSaveTemplateDialog(true);
                }}
              >
                <SaveIcon />
              </IconButton>
              <Button
                variant="outlined"
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    borderColor: 'primary.dark',
                  },
                }}
                onClick={() => setOpenTemplateDialog(true)}
                startIcon={<ArticleIcon />}
              >
                Selección
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog para seleccionar plantilla */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openTemplateDialog}
        onClose={() => setOpenTemplateDialog(false)}
      >
        <Box sx={{ p: 2 }}>
          <SelectTemplate closeDialog={() => setOpenTemplateDialog(false)} />
        </Box>
      </Dialog>

      {/* Dialog para guardar plantilla */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openSaveTemplateDialog}
        onClose={() => setOpenSaveTemplateDialog(false)}
      >
        <Box sx={{ p: 2 }}>
          <TemplateComponent
            closeDialog={() => setOpenSaveTemplateDialog(false)}
          />
        </Box>
      </Dialog>

      {/* Dialog para imprimir */}
      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title="Recepción de Paddy"
        dialogWidth="md"
      >
        <ReceptionToPrint />
      </PrintDialog>
    </>
  );
}
