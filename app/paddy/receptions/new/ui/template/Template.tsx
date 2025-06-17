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
  IconButton,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
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

  // Inicializar con valores del template actual y reinicializar TemplateTable
  useEffect(() => {
    setUseToleranceGroup(data.template.useToleranceGroup);
    setGroupToleranceValue(data.template.groupToleranceValue);
    // Reinicializar el estado del TemplateTable cada vez que se abre el diálogo
    templateTableRef.current?.reinitializeState();
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

  const handleLoadTemplate = async () => {
    try {
      // Obtener la configuración del TemplateTable
      const templateConfig = templateTableRef.current?.getTemplateConfiguration();
      if (!templateConfig) {
        showAlert("Error al obtener la configuración de la plantilla", "error");
        return;
      }

      // Primero actualizar data.template con la configuración (no valores)
      setTemplateField("useToleranceGroup", useToleranceGroup);
      setTemplateField("groupToleranceValue", groupToleranceValue);

      // Actualizar configuraciones en data.template
      Object.keys(templateConfig).forEach(key => {
        if (key.startsWith('available') || key.startsWith('showTolerance') || key.startsWith('groupTolerance')) {
          setTemplateField(key as any, templateConfig[key]);
        }
      });

      // Usar setTimeout para asegurar que los cambios de template se apliquen primero
      setTimeout(() => {
        // Para cada parámetro, si está deshabilitado (available: false), resetear sus valores a cero
        const parametersToReset = ['Humedad', 'GranosVerdes', 'Impurezas', 'Vano', 'Hualcacho', 'GranosManchados', 'GranosPelados', 'GranosYesosos'];
        
        parametersToReset.forEach(param => {
          const availableKey = `available${param}` as any;
          if (!templateConfig[availableKey]) {
            // Resetear valores en liveClusters
            const clusterKey = param as keyof typeof liveClusters;
            if (liveClusters[clusterKey]) {
              const cluster = liveClusters[clusterKey];
              if ('percent' in cluster && cluster.percent) {
                cluster.percent.onChange(0);
              }
              if ('tolerance' in cluster && cluster.tolerance) {
                cluster.tolerance.onChange(0);
              }
              if ('range' in cluster && cluster.range) {
                cluster.range.onChange(0);
              }
              if ('penalty' in cluster && cluster.penalty) {
                cluster.penalty.onChange(0);
              }
            }
          }
        });

        // Resetear Bonus y Dry si están deshabilitados
        if (!templateConfig.availableBonus && liveClusters.Bonus) {
          if (liveClusters.Bonus.tolerance) {
            liveClusters.Bonus.tolerance.onChange(0);
          }
        }

        if (!templateConfig.availableDry) {
          const dryCluster = liveClusters.Dry;
          if (dryCluster && 'percent' in dryCluster && dryCluster.percent) {
            dryCluster.percent.onChange(0);
          }
        }

        showAlert("Configuración de plantilla aplicada correctamente", "success");
        closeDialog(); // Cerrar el diálogo después de cargar la configuración
      }, 100); // Pequeño delay para asegurar que los cambios se propaguen

    } catch (error) {
      showAlert("Error al cargar la configuración de la plantilla", "error");
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
          sx={{ mr: 1 }}
        >
          {saving ? "Guardando..." : "Guardar plantilla"}
        </Button>
        <IconButton
          onClick={handleLoadTemplate}
          title="Cargar configuración de plantilla"
        >
          <PlayCircleIcon fontSize="large" color="primary" />
        </IconButton>
      </Grid>
    </Grid>
  );
}
