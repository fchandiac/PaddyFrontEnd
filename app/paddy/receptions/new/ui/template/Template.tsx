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
  const { data, setField, setTemplate, setTemplateField } = useReceptionContext();

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

      availableHumedad: data.template.availableHumedad,
      percentHumedad: data.template.percentHumedad,
      toleranceHumedad: data.template.toleranceHumedad,
      showToleranceHumedad: data.template.showToleranceHumedad,
      groupToleranceHumedad: data.template.groupToleranceHumedad,

      availableGranosVerdes: data.template.availableGranosVerdes,
      percentGranosVerdes: data.template.percentGranosVerdes,
      toleranceGranosVerdes: data.template.toleranceGranosVerdes,
      showToleranceGranosVerdes: data.template.showToleranceGranosVerdes,
      groupToleranceGranosVerdes: data.template.groupToleranceGranosVerdes,

      availableImpurezas: data.template.availableImpurezas,
      percentImpurezas: data.template.percentImpurezas,
      toleranceImpurezas: data.template.toleranceImpurezas,
      showToleranceImpurezas: data.template.showToleranceImpurezas,
      groupToleranceImpurezas: data.template.groupToleranceImpurezas,

      availableVano: data.template.availableVano,
      percentVano: data.template.percentVano,
      toleranceVano: data.template.toleranceVano,
      showToleranceVano: data.template.showToleranceVano,
      groupToleranceVano: data.template.groupToleranceVano,

      availableHualcacho: data.template.availableHualcacho,
      percentHualcacho: data.template.percentHualcacho,
      toleranceHualcacho: data.template.toleranceHualcacho,
      showToleranceHualcacho: data.template.showToleranceHualcacho,
      groupToleranceHualcacho: data.template.groupToleranceHualcacho,

      availableGranosManchados: data.template.availableGranosManchados,
      percentGranosManchados: data.template.percentGranosManchados,
      toleranceGranosManchados: data.template.toleranceGranosManchados,
      showToleranceGranosManchados: data.template.showToleranceGranosManchados,
      groupToleranceGranosManchados:
        data.template.groupToleranceGranosManchados,

      availableGranosPelados: data.template.availableGranosPelados,
      percentGranosPelados: data.template.percentGranosPelados,
      toleranceGranosPelados: data.template.toleranceGranosPelados,
      showToleranceGranosPelados: data.template.showToleranceGranosPelados,
      groupToleranceGranosPelados: data.template.groupToleranceGranosPelados,

      availableGranosYesosos: data.template.availableGranosYesosos,
      percentGranosYesosos: data.template.percentGranosYesosos,
      toleranceGranosYesosos: data.template.toleranceGranosYesosos,
      showToleranceGranosYesosos: data.template.showToleranceGranosYesosos,

      availableBonificacion: data.template.availableBonus,
      toleranceBonificacion: data.template.toleranceBonus,

      availableSecado: data.template.availableDry,
      percentSecado: data.template.percentDry,
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
