"use client";
import React, { useEffect, useState, useRef } from "react";
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
import TemplateTable, { TemplateTableRef } from "./TemplateTable";
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
  const templateTableRef = useRef<TemplateTableRef>(null);

  const [producers, setProducers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateProducerId, setNewTemplateProducerId] = useState<
    number | null
  >(null);
  const [useToleranceGroup, setUseToleranceGroup] = useState(false);
  const [groupToleranceValue, setGroupToleranceValue] = useState(0);

  // Inicializar con valores del template actual
  useEffect(() => {
    setUseToleranceGroup(data.template.useToleranceGroup);
    setGroupToleranceValue(data.template.groupToleranceValue);
  }, [data.template]);

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

    // Obtener los valores editados del TemplateTable
    const localTemplate = templateTableRef.current?.getLocalTemplate();
    if (!localTemplate) {
      showAlert("Error al obtener la configuración de la plantilla", "error");
      return;
    }

    const payload: CreateTemplateType = {
      name: newTemplateName,
      producerId: newTemplateProducerId ?? undefined,
      useToleranceGroup: useToleranceGroup,
      groupToleranceValue: groupToleranceValue,

      // Usamos los valores del estado local del TemplateTable
      availableHumedad: localTemplate.availableHumedad,
      percentHumedad: localTemplate.percentHumedad,
      toleranceHumedad: localTemplate.toleranceHumedad,
      showToleranceHumedad: localTemplate.showToleranceHumedad,
      groupToleranceHumedad: localTemplate.groupToleranceHumedad,

      availableGranosVerdes: localTemplate.availableGranosVerdes,
      percentGranosVerdes: localTemplate.percentGranosVerdes,
      toleranceGranosVerdes: localTemplate.toleranceGranosVerdes,
      showToleranceGranosVerdes: localTemplate.showToleranceGranosVerdes,
      groupToleranceGranosVerdes: localTemplate.groupToleranceGranosVerdes,

      availableImpurezas: localTemplate.availableImpurezas,
      percentImpurezas: localTemplate.percentImpurezas,
      toleranceImpurezas: localTemplate.toleranceImpurezas,
      showToleranceImpurezas: localTemplate.showToleranceImpurezas,
      groupToleranceImpurezas: localTemplate.groupToleranceImpurezas,

      availableVano: localTemplate.availableVano,
      percentVano: localTemplate.percentVano,
      toleranceVano: localTemplate.toleranceVano,
      showToleranceVano: localTemplate.showToleranceVano,
      groupToleranceVano: localTemplate.groupToleranceVano,

      availableHualcacho: localTemplate.availableHualcacho,
      percentHualcacho: localTemplate.percentHualcacho,
      toleranceHualcacho: localTemplate.toleranceHualcacho,
      showToleranceHualcacho: localTemplate.showToleranceHualcacho,
      groupToleranceHualcacho: localTemplate.groupToleranceHualcacho,

      availableGranosManchados: localTemplate.availableGranosManchados,
      percentGranosManchados: localTemplate.percentGranosManchados,
      toleranceGranosManchados: localTemplate.toleranceGranosManchados,
      showToleranceGranosManchados: localTemplate.showToleranceGranosManchados,
      groupToleranceGranosManchados: localTemplate.groupToleranceGranosManchados,

      availableGranosPelados: localTemplate.availableGranosPelados,
      percentGranosPelados: localTemplate.percentGranosPelados,
      toleranceGranosPelados: localTemplate.toleranceGranosPelados,
      showToleranceGranosPelados: localTemplate.showToleranceGranosPelados,
      groupToleranceGranosPelados: localTemplate.groupToleranceGranosPelados,

      availableGranosYesosos: localTemplate.availableGranosYesosos,
      percentGranosYesosos: localTemplate.percentGranosYesosos,
      toleranceGranosYesosos: localTemplate.toleranceGranosYesosos,
      showToleranceGranosYesosos: localTemplate.showToleranceGranosYesosos,
      groupToleranceGranosYesosos: localTemplate.groupToleranceGranosYesosos,

      availableBonificacion: localTemplate.availableBonus,
      toleranceBonificacion: localTemplate.toleranceBonus,

      availableSecado: localTemplate.availableDry,
      percentSecado: localTemplate.percentDry,
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
                    checked={useToleranceGroup}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setUseToleranceGroup(checked);
                      // Actualizar también el TemplateTable
                      templateTableRef.current?.updateUseToleranceGroup(checked);
                    }}
                  />
                }
                label="Usar grupo de tolerancia"
              />
            </Grid>
            {useToleranceGroup && (
              <Grid item xs={12}>
                <TextField
                  label="Valor grupo de tolerancia"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={groupToleranceValue}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const newVal = isNaN(val) ? 0 : val;
                    setGroupToleranceValue(newVal);
                    // Actualizar también el TemplateTable
                    templateTableRef.current?.updateGroupToleranceValue(newVal);
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
            <TemplateTable ref={templateTableRef} />
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
