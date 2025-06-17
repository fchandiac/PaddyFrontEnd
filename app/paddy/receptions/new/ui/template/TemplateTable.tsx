"use client";

import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Switch,
} from "@mui/material";
import { useReceptionContext } from "@/context/ReceptionDataContext";

interface ParamLoadType {
  name: string;
  available: boolean;
  percent: number;
  tolerance: number;
  showTolerance: boolean;
  groupTolerance: boolean;
  setAvailable: (value: boolean) => void;
  setShowTolerance?: (value: boolean) => void;
  setGroupTolerance?: (value: boolean) => void;
  setPercent?: (value: number) => void;
  setTolerance?: (value: number) => void;
}

export interface TemplateTableRef {
  getLocalTemplate: () => any;
  updateUseToleranceGroup: (value: boolean) => void;
  updateGroupToleranceValue: (value: number) => void;
  reinitializeState: () => void;
  getTemplateConfiguration: () => any;
}

const TemplateTable = forwardRef<TemplateTableRef>((props, ref) => {
  const { data, liveClusters } = useReceptionContext();
  
  // Estado local para el template en edición (NO modifica data.template)
  const [localTemplate, setLocalTemplate] = useState({
    availableHumedad: false,
    showToleranceHumedad: false,
    groupToleranceHumedad: false,
    percentHumedad: 0,
    toleranceHumedad: 0,
    
    availableGranosVerdes: false,
    showToleranceGranosVerdes: false,
    groupToleranceGranosVerdes: false,
    percentGranosVerdes: 0,
    toleranceGranosVerdes: 0,
    
    availableImpurezas: false,
    showToleranceImpurezas: false,
    groupToleranceImpurezas: false,
    percentImpurezas: 0,
    toleranceImpurezas: 0,
    
    availableVano: false,
    showToleranceVano: false,
    groupToleranceVano: false,
    percentVano: 0,
    toleranceVano: 0,
    
    availableHualcacho: false,
    showToleranceHualcacho: false,
    groupToleranceHualcacho: false,
    percentHualcacho: 0,
    toleranceHualcacho: 0,
    
    availableGranosManchados: false,
    showToleranceGranosManchados: false,
    groupToleranceGranosManchados: false,
    percentGranosManchados: 0,
    toleranceGranosManchados: 0,
    
    availableGranosPelados: false,
    showToleranceGranosPelados: false,
    groupToleranceGranosPelados: false,
    percentGranosPelados: 0,
    toleranceGranosPelados: 0,
    
    availableGranosYesosos: false,
    showToleranceGranosYesosos: false,
    groupToleranceGranosYesosos: false,
    percentGranosYesosos: 0,
    toleranceGranosYesosos: 0,
    
    availableBonus: false,
    toleranceBonus: 0,
    
    availableDry: false,
    percentDry: 0,
    
    useToleranceGroup: false,
    groupToleranceValue: 0,
  });

  // Inicializar estado local con valores actuales del template al abrir (solo una vez)
  useEffect(() => {
    setLocalTemplate({
      availableHumedad: data.template.availableHumedad,
      showToleranceHumedad: data.template.showToleranceHumedad,
      groupToleranceHumedad: data.template.groupToleranceHumedad,
      percentHumedad: liveClusters.Humedad.percent.value,
      toleranceHumedad: liveClusters.Humedad.tolerance.value,
      
      availableGranosVerdes: data.template.availableGranosVerdes,
      showToleranceGranosVerdes: data.template.showToleranceGranosVerdes,
      groupToleranceGranosVerdes: data.template.groupToleranceGranosVerdes,
      percentGranosVerdes: liveClusters.GranosVerdes.percent.value,
      toleranceGranosVerdes: liveClusters.GranosVerdes.tolerance.value,
      
      availableImpurezas: data.template.availableImpurezas,
      showToleranceImpurezas: data.template.showToleranceImpurezas,
      groupToleranceImpurezas: data.template.groupToleranceImpurezas,
      percentImpurezas: liveClusters.Impurezas.percent.value,
      toleranceImpurezas: liveClusters.Impurezas.tolerance.value,
      
      availableVano: data.template.availableVano,
      showToleranceVano: data.template.showToleranceVano,
      groupToleranceVano: data.template.groupToleranceVano,
      percentVano: liveClusters.Vano.percent.value,
      toleranceVano: liveClusters.Vano.tolerance.value,
      
      availableHualcacho: data.template.availableHualcacho,
      showToleranceHualcacho: data.template.showToleranceHualcacho,
      groupToleranceHualcacho: data.template.groupToleranceHualcacho,
      percentHualcacho: liveClusters.Hualcacho.percent.value,
      toleranceHualcacho: liveClusters.Hualcacho.tolerance.value,
      
      availableGranosManchados: data.template.availableGranosManchados,
      showToleranceGranosManchados: data.template.showToleranceGranosManchados,
      groupToleranceGranosManchados: data.template.groupToleranceGranosManchados,
      percentGranosManchados: liveClusters.GranosManchados.percent.value,
      toleranceGranosManchados: liveClusters.GranosManchados.tolerance.value,
      
      availableGranosPelados: data.template.availableGranosPelados,
      showToleranceGranosPelados: data.template.showToleranceGranosPelados,
      groupToleranceGranosPelados: data.template.groupToleranceGranosPelados,
      percentGranosPelados: liveClusters.GranosPelados.percent.value,
      toleranceGranosPelados: liveClusters.GranosPelados.tolerance.value,
      
      availableGranosYesosos: data.template.availableGranosYesosos,
      showToleranceGranosYesosos: data.template.showToleranceGranosYesosos,
      groupToleranceGranosYesosos: data.template.groupToleranceGranosYesosos,
      percentGranosYesosos: liveClusters.GranosYesosos.percent.value,
      toleranceGranosYesosos: liveClusters.GranosYesosos.tolerance.value,
      
      availableBonus: data.template.availableBonus,
      toleranceBonus: liveClusters.Bonus.tolerance.value,
      
      availableDry: data.template.availableDry,
      percentDry: liveClusters.Dry.percent.value,
      
      useToleranceGroup: data.template.useToleranceGroup,
      groupToleranceValue: data.template.groupToleranceValue,
    });
  }, []); // Eliminar dependencias para que solo se ejecute una vez al montar

  // Función para actualizar el estado local (NO afecta data.template)
  const setLocalTemplateField = (field: string, value: any) => {
    setLocalTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Exponer el estado local a través de ref
  useImperativeHandle(ref, () => ({
    getLocalTemplate: () => localTemplate,
    updateUseToleranceGroup: (value: boolean) => {
      setLocalTemplate(prev => ({ ...prev, useToleranceGroup: value }));
    },
    updateGroupToleranceValue: (value: number) => {
      setLocalTemplate(prev => ({ ...prev, groupToleranceValue: value }));
    },
    // Método para reinicializar el estado cuando se abre el diálogo
    reinitializeState: () => {
      setLocalTemplate({
        availableHumedad: data.template.availableHumedad,
        showToleranceHumedad: data.template.showToleranceHumedad,
        groupToleranceHumedad: data.template.groupToleranceHumedad,
        percentHumedad: liveClusters.Humedad.percent.value,
        toleranceHumedad: liveClusters.Humedad.tolerance.value,
        
        availableGranosVerdes: data.template.availableGranosVerdes,
        showToleranceGranosVerdes: data.template.showToleranceGranosVerdes,
        groupToleranceGranosVerdes: data.template.groupToleranceGranosVerdes,
        percentGranosVerdes: liveClusters.GranosVerdes.percent.value,
        toleranceGranosVerdes: liveClusters.GranosVerdes.tolerance.value,
        
        availableImpurezas: data.template.availableImpurezas,
        showToleranceImpurezas: data.template.showToleranceImpurezas,
        groupToleranceImpurezas: data.template.groupToleranceImpurezas,
        percentImpurezas: liveClusters.Impurezas.percent.value,
        toleranceImpurezas: liveClusters.Impurezas.tolerance.value,
        
        availableVano: data.template.availableVano,
        showToleranceVano: data.template.showToleranceVano,
        groupToleranceVano: data.template.groupToleranceVano,
        percentVano: liveClusters.Vano.percent.value,
        toleranceVano: liveClusters.Vano.tolerance.value,
        
        availableHualcacho: data.template.availableHualcacho,
        showToleranceHualcacho: data.template.showToleranceHualcacho,
        groupToleranceHualcacho: data.template.groupToleranceHualcacho,
        percentHualcacho: liveClusters.Hualcacho.percent.value,
        toleranceHualcacho: liveClusters.Hualcacho.tolerance.value,
        
        availableGranosManchados: data.template.availableGranosManchados,
        showToleranceGranosManchados: data.template.showToleranceGranosManchados,
        groupToleranceGranosManchados: data.template.groupToleranceGranosManchados,
        percentGranosManchados: liveClusters.GranosManchados.percent.value,
        toleranceGranosManchados: liveClusters.GranosManchados.tolerance.value,
        
        availableGranosPelados: data.template.availableGranosPelados,
        showToleranceGranosPelados: data.template.showToleranceGranosPelados,
        groupToleranceGranosPelados: data.template.groupToleranceGranosPelados,
        percentGranosPelados: liveClusters.GranosPelados.percent.value,
        toleranceGranosPelados: liveClusters.GranosPelados.tolerance.value,
        
        availableGranosYesosos: data.template.availableGranosYesosos,
        showToleranceGranosYesosos: data.template.showToleranceGranosYesosos,
        groupToleranceGranosYesosos: data.template.groupToleranceGranosYesosos,
        percentGranosYesosos: liveClusters.GranosYesosos.percent.value,
        toleranceGranosYesosos: liveClusters.GranosYesosos.tolerance.value,
        
        availableBonus: data.template.availableBonus,
        toleranceBonus: liveClusters.Bonus.tolerance.value,
        
        availableDry: data.template.availableDry,
        percentDry: liveClusters.Dry.percent.value,
        
        useToleranceGroup: data.template.useToleranceGroup,
        groupToleranceValue: data.template.groupToleranceValue,
      });
    },
    getTemplateConfiguration: () => ({
      useToleranceGroup: localTemplate.useToleranceGroup,
      groupToleranceValue: localTemplate.groupToleranceValue,
      availableHumedad: localTemplate.availableHumedad,
      showToleranceHumedad: localTemplate.showToleranceHumedad,
      groupToleranceHumedad: localTemplate.groupToleranceHumedad,
      availableGranosVerdes: localTemplate.availableGranosVerdes,
      showToleranceGranosVerdes: localTemplate.showToleranceGranosVerdes,
      groupToleranceGranosVerdes: localTemplate.groupToleranceGranosVerdes,
      availableImpurezas: localTemplate.availableImpurezas,
      showToleranceImpurezas: localTemplate.showToleranceImpurezas,
      groupToleranceImpurezas: localTemplate.groupToleranceImpurezas,
      availableVano: localTemplate.availableVano,
      showToleranceVano: localTemplate.showToleranceVano,
      groupToleranceVano: localTemplate.groupToleranceVano,
      availableHualcacho: localTemplate.availableHualcacho,
      showToleranceHualcacho: localTemplate.showToleranceHualcacho,
      groupToleranceHualcacho: localTemplate.groupToleranceHualcacho,
      availableGranosManchados: localTemplate.availableGranosManchados,
      showToleranceGranosManchados: localTemplate.showToleranceGranosManchados,
      groupToleranceGranosManchados: localTemplate.groupToleranceGranosManchados,
      availableGranosPelados: localTemplate.availableGranosPelados,
      showToleranceGranosPelados: localTemplate.showToleranceGranosPelados,
      groupToleranceGranosPelados: localTemplate.groupToleranceGranosPelados,
      availableGranosYesosos: localTemplate.availableGranosYesosos,
      showToleranceGranosYesosos: localTemplate.showToleranceGranosYesosos,
      groupToleranceGranosYesosos: localTemplate.groupToleranceGranosYesosos,
      availableBonus: localTemplate.availableBonus,
      availableDry: localTemplate.availableDry,
    })
  }));

  const grainParamsData: ParamLoadType[] = [
    {
      name: "Humedad",
      available: localTemplate.availableHumedad,
      percent: localTemplate.percentHumedad,
      tolerance: localTemplate.toleranceHumedad,
      showTolerance: localTemplate.showToleranceHumedad,
      groupTolerance: localTemplate.groupToleranceHumedad,
      setAvailable: (v) => setLocalTemplateField("availableHumedad", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceHumedad", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceHumedad", v),
      setPercent: (v) => setLocalTemplateField("percentHumedad", v),
      setTolerance: (v) => setLocalTemplateField("toleranceHumedad", v),
    },
    {
      name: "Granos verdes",
      available: localTemplate.availableGranosVerdes,
      percent: localTemplate.percentGranosVerdes,
      tolerance: localTemplate.toleranceGranosVerdes,
      showTolerance: localTemplate.showToleranceGranosVerdes,
      groupTolerance: localTemplate.groupToleranceGranosVerdes,
      setAvailable: (v) => setLocalTemplateField("availableGranosVerdes", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceGranosVerdes", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceGranosVerdes", v),
      setPercent: (v) => setLocalTemplateField("percentGranosVerdes", v),
      setTolerance: (v) => setLocalTemplateField("toleranceGranosVerdes", v),
    },
    {
      name: "Impurezas",
      available: localTemplate.availableImpurezas,
      percent: localTemplate.percentImpurezas,
      tolerance: localTemplate.toleranceImpurezas,
      showTolerance: localTemplate.showToleranceImpurezas,
      groupTolerance: localTemplate.groupToleranceImpurezas,
      setAvailable: (v) => setLocalTemplateField("availableImpurezas", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceImpurezas", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceImpurezas", v),
      setPercent: (v) => setLocalTemplateField("percentImpurezas", v),
      setTolerance: (v) => setLocalTemplateField("toleranceImpurezas", v),
    },
    {
      name: "Vano",
      available: localTemplate.availableVano,
      percent: localTemplate.percentVano,
      tolerance: localTemplate.toleranceVano,
      showTolerance: localTemplate.showToleranceVano,
      groupTolerance: localTemplate.groupToleranceVano,
      setAvailable: (v) => setLocalTemplateField("availableVano", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceVano", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceVano", v),
      setPercent: (v) => setLocalTemplateField("percentVano", v),
      setTolerance: (v) => setLocalTemplateField("toleranceVano", v),
    },
    {
      name: "Hualcacho",
      available: localTemplate.availableHualcacho,
      percent: localTemplate.percentHualcacho,
      tolerance: localTemplate.toleranceHualcacho,
      showTolerance: localTemplate.showToleranceHualcacho,
      groupTolerance: localTemplate.groupToleranceHualcacho,
      setAvailable: (v) => setLocalTemplateField("availableHualcacho", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceHualcacho", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceHualcacho", v),
      setPercent: (v) => setLocalTemplateField("percentHualcacho", v),
      setTolerance: (v) => setLocalTemplateField("toleranceHualcacho", v),
    },
    {
      name: "Granos manchados",
      available: localTemplate.availableGranosManchados,
      percent: localTemplate.percentGranosManchados,
      tolerance: localTemplate.toleranceGranosManchados,
      showTolerance: localTemplate.showToleranceGranosManchados,
      groupTolerance: localTemplate.groupToleranceGranosManchados,
      setAvailable: (v) => setLocalTemplateField("availableGranosManchados", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceGranosManchados", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceGranosManchados", v),
      setPercent: (v) => setLocalTemplateField("percentGranosManchados", v),
      setTolerance: (v) => setLocalTemplateField("toleranceGranosManchados", v),
    },
    {
      name: "Granos pelados",
      available: localTemplate.availableGranosPelados,
      percent: localTemplate.percentGranosPelados,
      tolerance: localTemplate.toleranceGranosPelados,
      showTolerance: localTemplate.showToleranceGranosPelados,
      groupTolerance: localTemplate.groupToleranceGranosPelados,
      setAvailable: (v) => setLocalTemplateField("availableGranosPelados", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceGranosPelados", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceGranosPelados", v),
      setPercent: (v) => setLocalTemplateField("percentGranosPelados", v),
      setTolerance: (v) => setLocalTemplateField("toleranceGranosPelados", v),
    },
    {
      name: "Granos yesosos",
      available: localTemplate.availableGranosYesosos,
      percent: localTemplate.percentGranosYesosos,
      tolerance: localTemplate.toleranceGranosYesosos,
      showTolerance: localTemplate.showToleranceGranosYesosos,
      groupTolerance: localTemplate.groupToleranceGranosYesosos,
      setAvailable: (v) => setLocalTemplateField("availableGranosYesosos", v),
      setShowTolerance: (v) => setLocalTemplateField("showToleranceGranosYesosos", v),
      setGroupTolerance: (v) => setLocalTemplateField("groupToleranceGranosYesosos", v),
      setPercent: (v) => setLocalTemplateField("percentGranosYesosos", v),
      setTolerance: (v) => setLocalTemplateField("toleranceGranosYesosos", v),
    },
    {
      name: "Bonificación",
      available: localTemplate.availableBonus,
      percent: 0,
      tolerance: localTemplate.toleranceBonus,
      showTolerance: true,
      groupTolerance: false,
      setAvailable: (v) => setLocalTemplateField("availableBonus", v),
      setShowTolerance: () => undefined,
      setGroupTolerance: () => undefined,
      setPercent: (v) => {},
      setTolerance: (v) => setLocalTemplateField("toleranceBonus", v),
    },
    {
      name: "Secado",
      available: localTemplate.availableDry,
      percent: localTemplate.percentDry,
      tolerance: 0,
      showTolerance: false,
      groupTolerance: false,
      setAvailable: (v) => setLocalTemplateField("availableDry", v),
      setShowTolerance: () => undefined,
      setGroupTolerance: () => undefined,
      setPercent: (v) => setLocalTemplateField("percentDry", v),
      setTolerance: (v => {}),
    }
  ];

  return (
    <Box sx={{ px: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Disponible</TableCell>
            <TableCell>Parámetro</TableCell>
            <TableCell>Porcentaje</TableCell>
            <TableCell>Tolerancia</TableCell>
            <TableCell>Mostrar Tolerancia</TableCell>
            <TableCell>Grupo Tolerancia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grainParamsData.map((row, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>
                  <Switch
                    checked={row.available}
                    size="small"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      row.setAvailable(checked);
                      if (!checked) {
                        row.setShowTolerance?.(false);
                        row.setGroupTolerance?.(false);
                        row.setPercent?.(0);
                        row.setTolerance?.(0);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{`${row.percent.toFixed(2)} %`}</TableCell>
                <TableCell>{`${row.tolerance.toFixed(2)} %`}</TableCell>
                <TableCell>
                  {row.name === "Bonificación" || row.name === "Secado" ? (
                    // Para Bonus y Dry, no mostrar switch - solo espacio vacío
                    <Box sx={{ width: 40, height: 24 }} />
                  ) : (
                    <Switch
                      disabled={!row.available || row.groupTolerance}
                      checked={row.showTolerance && !row.groupTolerance}
                      size="small"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        row.setShowTolerance?.(checked);
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.name === "Bonificación" || row.name === "Secado" ? (
                    // Para Bonus y Dry, no mostrar switch - solo espacio vacío
                    <Box sx={{ width: 40, height: 24 }} />
                  ) : (
                    <Switch
                      disabled={!localTemplate.useToleranceGroup || !row.available}
                      checked={row.groupTolerance}
                      size="small"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        row.setGroupTolerance?.(checked);
                        if (checked) {
                          // Cuando se activa grupo de tolerancia: ocultar tolerancia individual
                          row.setShowTolerance?.(false);
                        }
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
});

TemplateTable.displayName = "TemplateTable";

export default TemplateTable;
