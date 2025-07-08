"use client";
import React, { useEffect, useState, useRef } from "react";
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
import ReceptionGeneralData, { focusOnProducer } from "./ui/ReceptionGeneralData";
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
  const { data, liveClusters, setTemplate, resetData, updateReceptionId } = useReceptionContext();
  const { user } = useUserContext();
  const { handleKeyDown } = useKeyboardNavigation();

  const [receptionSaved, setReceptionSaved] = useState(false);

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
      
      // Asegurarse que los valores numéricos sean realmente números y no strings o undefined
      const ensureNumber = (value: any): number => {
        if (value === undefined || value === null) return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      };

      // Construir el payload para la API
      console.log('🔥 DEBUG - Estado completo del contexto antes de crear payload:');
      console.log('data.price:', data.price, 'tipo:', typeof data.price);
      console.log('data.riceTypeId:', data.riceTypeId);
      console.log('data.producerId:', data.producerId);
      console.log('data.template?.id:', data.template?.id);
      console.log('user:', user);
      console.log('data completo:', JSON.stringify(data, null, 2));
      
      const payload: CreateReceptionPayload = {
        producerId: data.producerId,
        riceTypeId: data.riceTypeId,
        templateId: data.template?.id || undefined, // Usando el nuevo campo templateId
        price: ensureNumber(data.price),
        guide: data.guide || "",
        licensePlate: data.licensePlate || "",
        
        // Pesos - asegurarse que sean números
        grossWeight: ensureNumber(liveClusters.grossWeight.node?.value),
        tare: ensureNumber(liveClusters.tare.node?.value),
        netWeight: ensureNumber(liveClusters.netWeight.node?.value),
        
        // Parámetros - asegurarse que sean números
        percentHumedad: ensureNumber(liveClusters.Humedad.percent?.value),
        toleranceHumedad: ensureNumber(liveClusters.Humedad.tolerance?.value),
        
        percentGranosVerdes: ensureNumber(liveClusters.GranosVerdes.percent?.value),
        toleranceGranosVerdes: ensureNumber(liveClusters.GranosVerdes.tolerance?.value),
        
        percentImpurezas: ensureNumber(liveClusters.Impurezas.percent?.value),
        toleranceImpurezas: ensureNumber(liveClusters.Impurezas.tolerance?.value),
        
        percentVano: ensureNumber(liveClusters.Vano.percent?.value),
        toleranceVano: ensureNumber(liveClusters.Vano.tolerance?.value),
        
        percentHualcacho: ensureNumber(liveClusters.Hualcacho.percent?.value),
        toleranceHualcacho: ensureNumber(liveClusters.Hualcacho.tolerance?.value),
        
        percentGranosManchados: ensureNumber(liveClusters.GranosManchados.percent?.value),
        toleranceGranosManchados: ensureNumber(liveClusters.GranosManchados.tolerance?.value),
        
        percentGranosPelados: ensureNumber(liveClusters.GranosPelados.percent?.value),
        toleranceGranosPelados: ensureNumber(liveClusters.GranosPelados.tolerance?.value),
        
        percentGranosYesosos: ensureNumber(liveClusters.GranosYesosos.percent?.value),
        toleranceGranosYesosos: ensureNumber(liveClusters.GranosYesosos.tolerance?.value),
        
        // Bonificación y secado
        toleranceBonificacion: ensureNumber(liveClusters.Bonus.tolerance?.value),
        percentSecado: ensureNumber(liveClusters.Dry.percent?.value),
        
        // Cálculos derivados (en Kg) - requeridos por el backend
        totalDiscount: ensureNumber(liveClusters.DiscountTotal?.node?.value || 0),
        bonus: ensureNumber(liveClusters.Bonus?.penalty?.value || 0),
        paddyNet: ensureNumber(liveClusters.totalPaddy?.node?.value || 0),
        
        // Nota/observación
        note: data.note || "",
        
        // Estado predeterminado
        status: "pending"
      };

      console.log('🔥 DEBUG - Payload final que se enviará al backend:');
      console.log('payload.price:', payload.price, 'tipo:', typeof payload.price);
      console.log('ensureNumber(data.price):', ensureNumber(data.price), 'data.price original:', data.price, 'tipo data.price:', typeof data.price);
      console.log('payload completo:', JSON.stringify(payload, null, 2));

      // Llamar a la API para crear la recepción
      const result = await createReception(payload);
      
      // Actualizar el ID de la recepción en el contexto para que aparezca en la impresión
      updateReceptionId(result.id);
      
      showAlert("Recepción guardada correctamente", "success");
      
      // Guardar temporalmente los datos para imprimir
      setReceptionSaved(true);
      
      // Abrir automáticamente el diálogo de impresión
      setOpenPrintDialog(true);
      
      // NO limpiar los datos aquí - se hará cuando se cierre el diálogo de impresión
      // resetData();
      
    } catch (error) {
      console.error("Error al guardar la recepción:", error);
      showAlert(`Error al guardar la recepción: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoadingSave(false);
    }
  };

  // Effect para manejar el focus cuando se cierra el diálogo de impresión
  useEffect(() => {
    if (!openPrintDialog && receptionSaved) {
      // Focus on producer field when dialog is closed with increased timeout
      setTimeout(focusOnProducer, 500);
      
      // Resetear los datos cuando se cierre el diálogo de impresión
      // (esto permite que la impresión tenga acceso a los datos antes de resetear)
      resetData();
      setReceptionSaved(false);
    }
  }, [openPrintDialog, receptionSaved, resetData]);

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
            
            <Divider />
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
        receptionData={{
          id: data.id,
          producerRut: data.producerRut,
          producerName: data.producerName
        }}
      >
        <ReceptionToPrint />
      </PrintDialog>
    </>
  );
}
