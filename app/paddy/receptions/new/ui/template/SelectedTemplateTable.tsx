"use client";

import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Switch,
  IconButton,
  Typography,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { TemplateType } from  "@/types/discount-template"
import { useReceptionContext } from "@/context/ReceptionDataContext";




const keyMap: Record<string, string> = {
  humedad: "Humedad",
  granosVerdes: "Granos verdes",
  impurezas: "Impurezas",
  vano: "Vano",
  hualcacho: "Hualcacho",
  granosManchados: "Granos manchados",
  granosPelados: "Granos pelados",
  granosYesosos: "Granos yesosos",
  bonus: "Bonificación",
  dry: "Secado",
};


interface SelectedTemplateTableProps {
  selectedTemplate: TemplateType;
  closeDialog: () => void;
}




const SelectedTemplateTable: React.FC<SelectedTemplateTableProps> = ({selectedTemplate, closeDialog}) =>  {
  const { setTemplateField, setTemplate, data, liveClusters } = useReceptionContext();



  const paramsData = [
    { name: "Humedad", available: selectedTemplate.availableHumedad, showTolerance: selectedTemplate.showToleranceHumedad, groupTolerance: selectedTemplate.groupToleranceHumedad },
    { name: "Granos verdes", available: selectedTemplate.availableGranosVerdes, showTolerance: selectedTemplate.showToleranceGranosVerdes, groupTolerance: selectedTemplate.groupToleranceGranosVerdes },
    { name: "Impurezas", available: selectedTemplate.availableImpurezas, showTolerance: selectedTemplate.showToleranceImpurezas, groupTolerance: selectedTemplate.groupToleranceImpurezas },
    { name: "Vano", available: selectedTemplate.availableVano, showTolerance: selectedTemplate.showToleranceVano, groupTolerance: selectedTemplate.groupToleranceVano },
    { name: "Hualcacho", available: selectedTemplate.availableHualcacho, showTolerance: selectedTemplate.showToleranceHualcacho, groupTolerance: selectedTemplate.groupToleranceHualcacho },
    { name: "Granos pelados", available: selectedTemplate.availableGranosPelados, showTolerance: selectedTemplate.showToleranceGranosPelados, groupTolerance: selectedTemplate.groupToleranceGranosPelados },
    { name: "Granos yesosos", available: selectedTemplate.availableGranosYesosos, showTolerance: selectedTemplate.showToleranceGranosYesosos, groupTolerance: selectedTemplate.groupToleranceGranosYesosos },
    { name: "Granos manchados", available: selectedTemplate.availableGranosManchados, showTolerance: selectedTemplate.showToleranceGranosManchados, groupTolerance: selectedTemplate.groupToleranceGranosManchados },
    { name: "Bonificación", available: selectedTemplate.availableBonus, showTolerance: true, groupTolerance: false },
    { name: "Secado", available: selectedTemplate.availableDry, showTolerance: false, groupTolerance: false },
  ];



  const handleApply = () => {
    if (!selectedTemplate) return;
    console.log('🔥 Cargando configuración de plantilla:', selectedTemplate);
    
    // Solo cargar configuración, no valores de parámetros
    
    // Actualizar configuraciones de disponibilidad
    setTemplateField("availableHumedad", selectedTemplate.availableHumedad);
    setTemplateField("availableGranosVerdes", selectedTemplate.availableGranosVerdes);
    setTemplateField("availableImpurezas", selectedTemplate.availableImpurezas);
    setTemplateField("availableVano", selectedTemplate.availableVano);
    setTemplateField("availableHualcacho", selectedTemplate.availableHualcacho);
    setTemplateField("availableGranosManchados", selectedTemplate.availableGranosManchados);
    setTemplateField("availableGranosPelados", selectedTemplate.availableGranosPelados);
    setTemplateField("availableGranosYesosos", selectedTemplate.availableGranosYesosos);
    setTemplateField("availableBonus", selectedTemplate.availableBonus);
    setTemplateField("availableDry", selectedTemplate.availableDry);
    
    // Actualizar configuraciones de tolerancia
    setTemplateField("showToleranceHumedad", selectedTemplate.showToleranceHumedad);
    setTemplateField("showToleranceGranosVerdes", selectedTemplate.showToleranceGranosVerdes);
    setTemplateField("showToleranceImpurezas", selectedTemplate.showToleranceImpurezas);
    setTemplateField("showToleranceVano", selectedTemplate.showToleranceVano);
    setTemplateField("showToleranceHualcacho", selectedTemplate.showToleranceHualcacho);
    setTemplateField("showToleranceGranosManchados", selectedTemplate.showToleranceGranosManchados);
    setTemplateField("showToleranceGranosPelados", selectedTemplate.showToleranceGranosPelados);
    setTemplateField("showToleranceGranosYesosos", selectedTemplate.showToleranceGranosYesosos);
    
    // Actualizar configuraciones de grupo de tolerancia
    setTemplateField("groupToleranceHumedad", selectedTemplate.groupToleranceHumedad);
    setTemplateField("groupToleranceGranosVerdes", selectedTemplate.groupToleranceGranosVerdes);
    setTemplateField("groupToleranceImpurezas", selectedTemplate.groupToleranceImpurezas);
    setTemplateField("groupToleranceVano", selectedTemplate.groupToleranceVano);
    setTemplateField("groupToleranceHualcacho", selectedTemplate.groupToleranceHualcacho);
    setTemplateField("groupToleranceGranosManchados", selectedTemplate.groupToleranceGranosManchados);
    setTemplateField("groupToleranceGranosPelados", selectedTemplate.groupToleranceGranosPelados);
    setTemplateField("groupToleranceGranosYesosos", selectedTemplate.groupToleranceGranosYesosos);
    
    // Actualizar configuraciones globales de tolerancia
    setTemplateField("useToleranceGroup", selectedTemplate.useToleranceGroup);
    setTemplateField("groupToleranceValue", selectedTemplate.groupToleranceValue);
    
    // Actualizar nombre de plantilla
    setTemplateField("name", selectedTemplate.name);
    
    // Usar setTimeout para asegurar que los cambios se apliquen primero
    setTimeout(() => {
      // Resetear valores de parámetros deshabilitados
      const parametersToReset = ['Humedad', 'GranosVerdes', 'Impurezas', 'Vano', 'Hualcacho', 'GranosManchados', 'GranosPelados', 'GranosYesosos'];
      
      parametersToReset.forEach(param => {
        const availableKey = `available${param}` as keyof typeof selectedTemplate;
        if (!selectedTemplate[availableKey]) {
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
      if (!selectedTemplate.availableBonus && liveClusters.Bonus) {
        if (liveClusters.Bonus.tolerance) {
          liveClusters.Bonus.tolerance.onChange(0);
        }
      }

      if (!selectedTemplate.availableDry) {
        const dryCluster = liveClusters.Dry;
        if (dryCluster && 'percent' in dryCluster && dryCluster.percent) {
          dryCluster.percent.onChange(0);
        }
      }
      
      console.log('🔥 Configuración de plantilla aplicada correctamente');
    }, 100);
    
    closeDialog();
  };

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ py: 1 }} display="flex" justifyContent="space-between">
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Plantilla: {selectedTemplate?.name}
        </Typography>
        {selectedTemplate?.producer?.name && (
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Productor: {selectedTemplate?.producer.name}
          </Typography>
        )}
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Disponible</TableCell>
            <TableCell>Parámetro</TableCell>
            <TableCell>Mostrar Tol.</TableCell>
            <TableCell>Grupo Tol.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paramsData.map((row, idx) => {
            const key = keyMap[row.name];
            return (
              <TableRow key={idx}>
                <TableCell>
                  <Switch
                    checked={row.available}
                    size="small"
                    onChange={(_, v) => setTemplateField(`available${key}` as any, v)}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.showTolerance !== undefined && (
                    <Switch
                      checked={row.showTolerance}
                      size="small"
                      onChange={(_, v) => setTemplateField(`showTolerance${key}` as any, v)}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.groupTolerance !== undefined && (
                    <Switch
                      checked={row.groupTolerance}
                      size="small"
                      onChange={(_, v) => setTemplateField(`groupTolerance${key}` as any, v)}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="center" mt={2}>
        <IconButton onClick={handleApply}>
          <PlayCircleIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SelectedTemplateTable;


