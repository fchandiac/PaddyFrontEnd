"use client";

import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
} from "@mui/material";
import { useAlertContext } from "@/context/AlertContext";
import { createReception } from "@/app/actions/reception";
import ReceptionGeneralData from "./ui/ReceptionGeneralData";
import ReceptionSummary from "./ui/ReceptionSummary";
import GrainAnalysis from "./ui/GrainAnalysis";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { ReceptionStatus, CreateReceptionPayload } from "@/types/reception";

export default function NewReceptionPage() {
  const { showAlert } = useAlertContext();
  const { data, resetData } = useReceptionContext();
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const requiredFields = [
      data.producerId,
      data.riceTypeId,
      data.price,
      data.grossWeight,
      data.tare,
    ];

    if (requiredFields.some((f) => !f)) {
      showAlert("Por favor complete todos los campos obligatorios.", "error");
      return;
    }

    const payload: CreateReceptionPayload = {
      producerId: data.producerId,
      riceTypeId: data.riceTypeId,
      price: parseInt(data.price.toString().replace(/\./g, "")),
      guide: data.guide,
      licensePlate: data.licensePlate,
      grossWeight: data.grossWeight,
      tare: data.tare,
      netWeight: data.netWeight,

      percentHumedad: data.percentHumedad,
      toleranceHumedad: data.toleranceHumedad,

      percentGranosVerdes: data.percentGranosVerdes,
      toleranceGranosVerdes: data.toleranceGranosVerdes,

      percentImpurezas: data.percentImpurezas,
      toleranceImpurezas: data.toleranceImpurezas,

      percentGranosManchados: data.percentGranosManchados,
      toleranceGranosManchados: data.toleranceGranosManchados,

      percentHualcacho: data.percentHualcacho,
      toleranceHualcacho: data.toleranceHualcacho,

      percentGranosPelados: data.percentGranosPelados,
      toleranceGranosPelados: data.toleranceGranosPelados,

      percentGranosYesosos: data.percentGranosYesosos,
      toleranceGranosYesosos: data.toleranceGranosYesosos,

      toleranceBonificacion: data.toleranceBonificacion,
      percentSecado: data.percentSecado,

      totalToPay: data.totalToPay,
      status: "pending",

      note: data.note,
    };

    setLoading(true);

    try {
      await createReception(payload);
      //console.log("Payload to save:", payload);
      showAlert("Recepción guardada exitosamente.", "success");
      //resetData();
    } catch (error) {
      console.error(error);
      showAlert("Error al guardar la recepción.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Datos de la recepción</Typography>
            <ReceptionGeneralData />
          </Grid>

          <Grid item xs={12} md={5.5}>
            <Typography gutterBottom>Análisis de granos</Typography>
            <GrainAnalysis />
          </Grid>

          <Grid item xs={12} md={2.5}>
            <Typography gutterBottom>Resumen de cálculo</Typography>
            <ReceptionSummary />

            <Button
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Guardar recepción"
              )}
            </Button>
            <Grid item xs={12} sx={{ mt: 2 }} textAlign={"right"}>
              <Button variant="outlined"

                onClick={() => setOpenTemplateDialog(true)}
              >Plantillas</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openTemplateDialog}
        onClose={() => setOpenTemplateDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Seleccionar plantilla
          </Typography>
          <ReceptionGeneralData />
          <GrainAnalysis />
          <ReceptionSummary />
        </Box>
        <Box sx={{ p: 2 }} textAlign={"right"}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenTemplateDialog(false);
              resetData();
            }}
          >
            Cargar plantilla
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenTemplateDialog(false)}
            sx={{ ml: 1 }}
          >
            Cancelar
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
