"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Button,
} from "@mui/material";
import TemplateTable from "./TemplateTable";
import { getAllProducers } from "@/app/actions/producer";
import { createDiscountTemplate } from "@/app/actions/discount-template";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { useAlertContext } from "@/context/AlertContext";
import { CreateTemplateType } from "@/types/discount-template";

interface TemplateProps {
  closeDialog: () => void;
}

export default function TemplateComponent({ closeDialog }: TemplateProps) {
  const { data, liveClusters, setField, setTemplate, setTemplateField } = useReceptionContext();

  const { showAlert } = useAlertContext();

  const [producers, setProducers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateProducerId, setNewTemplateProducerId] = useState<
    number | null
  >(null);

  const fetchProducers = async () => {
    const result = await getAllProducers();
    setProducers(result || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  useEffect(() => {
    if (data.producerId) {
      const selectedProducer = producers.find((p) => p.id === data.producerId);
    }
  }, [data.producerId, producers]);

  const handleSave = async () => {
    if (!newTemplateName) {
      showAlert("El nombre de la plantilla es obligatorio", "error");
      return;
    }

    const payload: CreateTemplateType = {
      name: newTemplateName,
      producerId: newTemplateProducerId ?? undefined,
      useToleranceGroup: data.template.useToleranceGroup,
      groupToleranceValue: data.template.groupToleranceValue,

      // Usamos los valores actuales de los clusters
      availableHumedad: liveClusters.Humedad.available,
      percentHumedad: liveClusters.Humedad.percent.value,
      toleranceHumedad: liveClusters.Humedad.tolerance.value,
      showToleranceHumedad: liveClusters.Humedad.tolerance.show,
      groupToleranceHumedad: liveClusters.Humedad.toleranceGroup,

      availableGranosVerdes: liveClusters.GranosVerdes.available,
      percentGranosVerdes: liveClusters.GranosVerdes.percent.value,
      toleranceGranosVerdes: liveClusters.GranosVerdes.tolerance.value,
      showToleranceGranosVerdes: liveClusters.GranosVerdes.tolerance.show,
      groupToleranceGranosVerdes: liveClusters.GranosVerdes.toleranceGroup,

      availableImpurezas: liveClusters.Impurezas.available,
      percentImpurezas: liveClusters.Impurezas.percent.value,
      toleranceImpurezas: liveClusters.Impurezas.tolerance.value,
      showToleranceImpurezas: liveClusters.Impurezas.tolerance.show,
      groupToleranceImpurezas: liveClusters.Impurezas.toleranceGroup,

      availableVano: liveClusters.Vano.available,
      percentVano: liveClusters.Vano.percent.value,
      toleranceVano: liveClusters.Vano.tolerance.value,
      showToleranceVano: liveClusters.Vano.tolerance.show,
      groupToleranceVano: liveClusters.Vano.toleranceGroup,

      availableHualcacho: liveClusters.Hualcacho.available,
      percentHualcacho: liveClusters.Hualcacho.percent.value,
      toleranceHualcacho: liveClusters.Hualcacho.tolerance.value,
      showToleranceHualcacho: liveClusters.Hualcacho.tolerance.show,
      groupToleranceHualcacho: liveClusters.Hualcacho.toleranceGroup,

      availableGranosManchados: liveClusters.GranosManchados.available,
      percentGranosManchados: liveClusters.GranosManchados.percent.value,
      toleranceGranosManchados: liveClusters.GranosManchados.tolerance.value,
      showToleranceGranosManchados: liveClusters.GranosManchados.tolerance.show,
      groupToleranceGranosManchados: liveClusters.GranosManchados.toleranceGroup,

      availableGranosPelados: liveClusters.GranosPelados.available,
      percentGranosPelados: liveClusters.GranosPelados.percent.value,
      toleranceGranosPelados: liveClusters.GranosPelados.tolerance.value,
      showToleranceGranosPelados: liveClusters.GranosPelados.tolerance.show,
      groupToleranceGranosPelados: liveClusters.GranosPelados.toleranceGroup,

      availableGranosYesosos: liveClusters.GranosYesosos.available,
      percentGranosYesosos: liveClusters.GranosYesosos.percent.value,
      toleranceGranosYesosos: liveClusters.GranosYesosos.tolerance.value,
      showToleranceGranosYesosos: liveClusters.GranosYesosos.tolerance.show,
      groupToleranceGranosYesosos: liveClusters.GranosYesosos.toleranceGroup,

      availableBonificacion: liveClusters.Bonus.tolerance.show,
      toleranceBonificacion: liveClusters.Bonus.tolerance.value,

      availableSecado: liveClusters.Dry.percent.show,
      percentSecado: liveClusters.Dry.percent.value,
    };

    try {
      setSaving(true);
      const res = await createDiscountTemplate(payload);
      if (res) {
        showAlert("Plantilla guardada correctamente", "success");
        setNewTemplateName("");
        setNewTemplateProducerId(null);
        setSaving(false);
        closeDialog();
      } else {
        showAlert("Error al guardar la plantilla", "error");
      }
    } catch (error) {
      showAlert("Error al guardar la plantilla", "error");
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: 1 }}>
      <Grid item xs={12}>
        <Typography variant="h6">Plantilla Análisis de Granos</Typography>
      </Grid>

      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12} md={3}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Plantilla en uso: {data.template.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Nombre nueva plantilla"
                variant="outlined"
                fullWidth
                size="small"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Autocomplete
                  options={producers}
                  getOptionLabel={(option) => `${option.rut} - ${option.name}`}
                  value={
                    producers.find((p) => p.id === newTemplateProducerId) ??
                    null
                  }
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setNewTemplateProducerId(newValue.id);
                    } else {
                      setNewTemplateProducerId(null);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Productor"
                      variant="outlined"
                      fullWidth
                      size="small"
                    />
                  )}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data.template.useToleranceGroup}
                    onChange={(e) => {
                      setTemplateField("useToleranceGroup", e.target.checked);
                    }}
                  />
                }
                label="Usar grupo de tolerancia"
              />
            </Grid>
            {data.template.useToleranceGroup && (
              <Grid item xs={12}>
                <TextField
                  label="Valor grupo de tolerancia"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={data.template.groupToleranceValue}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTemplateField(
                      "groupToleranceValue",
                      isNaN(val) ? 0 : val
                    );
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12} md={9}>
          <Box
            sx={{
              bgcolor: "#f7f7f7",
              p: 2,
              borderRadius: 2,
              border: "1px solid #ccc",
            }}
          >
            <TemplateTable />
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12} textAlign="right">
        <Button
          variant="contained"
          color="primary"
          disabled={saving}
          onClick={handleSave}
          startIcon={
            saving ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {saving ? "Guardando..." : "Guardar plantilla"}
        </Button>
      </Grid>
    </Grid>
  );
}
