"use client";
import React from "react";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import styles from "./ReceptionToPrint.module.css";

const parameterOrder = [
  "Humedad",
  "GranosVerdes", 
  "Impurezas",
  "Vano",
  "Hualcacho",
  "GranosPelados",
  "GranosYesosos",
  "GranosManchados",
];

export default function ReceptionToPrint() {
  const { data, liveClusters } = useReceptionContext();

  // Usar template del contexto si está disponible, sino usar template básico
  const template = data.template || {
    name: "Plantilla por defecto",
    useToleranceGroup: false,
    availableHumedad: true,
    availableGranosVerdes: true,
    availableImpurezas: true,
    availableVano: true,
    availableHualcacho: true,
    availableGranosPelados: true,
    availableGranosYesosos: true,
    availableGranosManchados: true,
    availableBonus: true,
    availableDry: true,
    showToleranceHumedad: true,
    showToleranceGranosVerdes: true,
    showToleranceImpurezas: true,
    showToleranceVano: true,
    showToleranceHualcacho: true,
    showToleranceGranosPelados: true,
    showToleranceGranosYesosos: true,
    showToleranceGranosManchados: true,
    groupToleranceHumedad: false,
    groupToleranceGranosVerdes: false,
    groupToleranceImpurezas: false,
    groupToleranceVano: false,
    groupToleranceHualcacho: false,
    groupToleranceGranosPelados: false,
    groupToleranceGranosYesosos: false,
    groupToleranceGranosManchados: false,
  };

  const netWeight = data.netWeight;

  // Map config for each base parameter
  const mapConfig: Record<string, {
    name: string;
    percent: number;
    tolerance: number;
    showTolerance: boolean;
    available: boolean;
    groupTolerance: boolean;
  }> = {
    Humedad: {
      name: "Humedad",
      percent: data.percentHumedad,
      tolerance: data.toleranceHumedad,
      showTolerance: template.showToleranceHumedad,
      available: template.availableHumedad,
      groupTolerance: template.groupToleranceHumedad,
    },
    GranosVerdes: {
      name: "Granos Verdes",
      percent: data.percentGranosVerdes,
      tolerance: data.toleranceGranosVerdes,
      showTolerance: template.showToleranceGranosVerdes,
      available: template.availableGranosVerdes,
      groupTolerance: template.groupToleranceGranosVerdes,
    },
    Impurezas: {
      name: "Impurezas",
      percent: data.percentImpurezas,
      tolerance: data.toleranceImpurezas,
      showTolerance: template.showToleranceImpurezas,
      available: template.availableImpurezas,
      groupTolerance: template.groupToleranceImpurezas,
    },
    Vano: {
      name: "Vano",
      percent: data.percentVano,
      tolerance: data.toleranceVano,
      showTolerance: template.showToleranceVano,
      available: template.availableVano,
      groupTolerance: template.groupToleranceVano,
    },
    Hualcacho: {
      name: "Hualcacho",
      percent: data.percentHualcacho,
      tolerance: data.toleranceHualcacho,
      showTolerance: template.showToleranceHualcacho,
      available: template.availableHualcacho,
      groupTolerance: template.groupToleranceHualcacho,
    },
    GranosPelados: {
      name: "Granos Pelados",
      percent: data.percentGranosPelados,
      tolerance: data.toleranceGranosPelados,
      showTolerance: template.showToleranceGranosPelados,
      available: template.availableGranosPelados,
      groupTolerance: template.groupToleranceGranosPelados,
    },
    GranosYesosos: {
      name: "Granos Yesosos",
      percent: data.percentGranosYesosos,
      tolerance: data.toleranceGranosYesosos,
      showTolerance: template.showToleranceGranosYesosos,
      available: template.availableGranosYesosos,
      groupTolerance: template.groupToleranceGranosYesosos,
    },
    GranosManchados: {
      name: "Granos Manchados",
      percent: data.percentGranosManchados,
      tolerance: data.toleranceGranosManchados,
      showTolerance: template.showToleranceGranosManchados,
      available: template.availableGranosManchados,
      groupTolerance: template.groupToleranceGranosManchados,
    },
  };

  // Build initial rows with proper order matching GrainAnalysis
  const rows: Array<{
    name: string;
    percent: number | string;
    tolerance: number | string;
    penalty: number | string;
    groupTolerance: boolean;
  }> = [];

  // First: Parameters that do NOT belong to tolerance group
  parameterOrder.forEach((name) => {
    const cfg = mapConfig[name];
    if (!cfg.available || (template.useToleranceGroup && cfg.groupTolerance)) return;
    const tol = cfg.showTolerance || (cfg.groupTolerance && template.useToleranceGroup)
      ? cfg.tolerance : 0;
    const pen = cfg.percent > tol
      ? +(((cfg.percent - tol) * netWeight) / 100).toFixed(2) : 0;
    rows.push({
      name,
      percent: cfg.percent,
      tolerance: cfg.showTolerance ? cfg.tolerance : "",
      penalty: pen,
      groupTolerance: cfg.groupTolerance,
    });
  });

  // Second: Parameters that belong to tolerance group
  parameterOrder.forEach((name) => {
    const cfg = mapConfig[name];
    if (!cfg.available || !(template.useToleranceGroup && cfg.groupTolerance)) return;
    const tol = cfg.showTolerance || (cfg.groupTolerance && template.useToleranceGroup)
      ? cfg.tolerance : 0;
    const pen = cfg.percent > tol
      ? +(((cfg.percent - tol) * netWeight) / 100).toFixed(2) : 0;
    rows.push({
      name,
      percent: cfg.percent,
      tolerance: cfg.showTolerance ? cfg.tolerance : "",
      penalty: pen,
      groupTolerance: cfg.groupTolerance,
    });
  });

  // Third: Total granos (GroupSummary) - only if there are group tolerance parameters
  const hasGroupToleranceParams = template.useToleranceGroup && Object.values(mapConfig).some(
    cfg => cfg.available && cfg.groupTolerance
  );
  
  if (hasGroupToleranceParams) {
    const groupSummaryPercent = liveClusters.groupSummary.percent.value;
    const groupSummaryTolerance = liveClusters.groupSummary.tolerance.value;
    const groupSummaryPenalty = liveClusters.groupSummary.penalty.value;
    
    rows.push({
      name: "Total granos",
      percent: groupSummaryPercent,
      tolerance: groupSummaryTolerance,
      penalty: groupSummaryPenalty,
      groupTolerance: false,
    });
  }

  // Fourth: Total Análisis (Summary)
  const calcPercentTotalAnalisis = Object.values(mapConfig).reduce((s, c) => s + c.percent, 0);
  const calcToleranceTotalAnalisis = Object.values(mapConfig).reduce((s, c) => s + c.tolerance, 0);
  const calcPenaltyTotalAnalisis = calcPercentTotalAnalisis > calcToleranceTotalAnalisis
    ? +(((calcPercentTotalAnalisis - calcToleranceTotalAnalisis) * netWeight) / 100).toFixed(2) : 0;
  
  rows.push({
    name: "Total Análisis",
    percent: calcPercentTotalAnalisis,
    tolerance: template.useToleranceGroup ? calcToleranceTotalAnalisis : "",
    penalty: calcPenaltyTotalAnalisis,
    groupTolerance: false,
  });

  // Bonificación
  const calcPenaltyBonificacion = liveClusters.Bonus.tolerance.value > 0
    ? +((liveClusters.Bonus.tolerance.value * netWeight) / 100).toFixed(2) : 0;
  if (template.availableBonus) {
    rows.push({
      name: "Bonificación",
      percent: liveClusters.Bonus.tolerance.value,
      tolerance: "",
      penalty: calcPenaltyBonificacion,
      groupTolerance: false,
    });
  }

  // Secado
  if (template.availableDry)
    rows.push({
      name: "Secado",
      percent: liveClusters.Dry.percent.value,
      tolerance: "",
      penalty: "",
      groupTolerance: false,
    });

  return (
    <Box px={4}>
      {/* Encabezado */}
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="body2" sx={{ fontSize: "12px" }}>Sociedad Comercial e Industrial</Typography>
          <Typography fontWeight="bold">Aparicio y García Ltda</Typography>
          <Typography variant="body2" sx={{ fontSize: "12px" }}>Panamericana Sur km 345</Typography>
          <Typography variant="body2" sx={{ fontSize: "12px" }}>Parral</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h5" fontWeight="bold">
            Recepción Paddy
          </Typography>
          <Typography>
            Fecha: {new Date().toLocaleDateString("es-CL")}
          </Typography>
          <Typography>Recepción N° {data.guide || "Nueva"}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Productor */}
      <Box
        sx={{
          width: "60%",
          display: "grid",
          gridTemplateColumns: "100px auto 1fr",
          rowGap: "1px",
          alignItems: "center",
        }}
      >
        {[
          { label: "Sr.", value: data.producerName || "N/A" },
          { label: "Rut", value: data.producerRut || "N/A" },
          { label: "Razón Social", value: data.producerBusinessName || "N/A" },
          { label: "Dirección", value: data.producerAddress || "N/A" },
          { label: "Guía N°", value: data.guide || "N/A" },
        ].map(({ label, value }) => (
          <React.Fragment key={label}>
            <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
              <strong>{label}</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
              <strong>:</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0, pl: 5 }}>
              {value}
            </Typography>
          </React.Fragment>
        ))}
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Vehículo */}
      <Box display="flex" justifyContent="space-between">
        <Box width="50%" sx={{ display: "grid", gridTemplateColumns: "100px auto 1fr", rowGap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
            <strong>Placa patente</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
            <strong>:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0, pl: 5 }}>
            {data.licensePlate || "N/A"}
          </Typography>
        </Box>

        <Box width="35%" sx={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", rowGap: "1px" }}>
          {[
            { label: "Peso bruto", value: `${Number(data.grossWeight || 0).toLocaleString("es-CL")} kg` },
            { label: "Tara camión", value: `${Number(data.tare || 0).toLocaleString("es-CL")} kg` },
            { label: "Peso neto", value: `${Number(data.netWeight || 0).toLocaleString("es-CL")} kg` },
          ].map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography variant="body2" sx={{ textAlign: "left", fontSize: "12px", py: 0 }}>
                <strong>{label}</strong>
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center", fontSize: "12px", py: 0 }}>
                <strong>:</strong>
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right", fontSize: "12px", py: 0 }}>
                {value}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Análisis */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" gutterBottom>
          Análisis de granos
        </Typography>
        {template.name && (
          <Typography variant="body2" sx={{ fontSize: "11px", color: "#666" }}>
            Plantilla: {template.name}
          </Typography>
        )}
      </Box>

      <Table size="small" sx={{ "& th, & td": { fontSize: "12px" } }}>
        <TableHead>
          <TableRow>
            <TableCell className={styles.tableHeader}>Parámetro</TableCell>
            <TableCell className={styles.tableHeader} align="right">Porcentaje</TableCell>
            <TableCell className={styles.tableHeader} align="right">Tolerancia</TableCell>
            <TableCell className={styles.tableHeader} align="right">Descuento neto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => {
            // Determinar las clases CSS basadas en el tipo de fila
            let backgroundClass = styles.whiteBackground; // Por defecto parámetros normales
            
            if (row.name === "Total granos") {
              backgroundClass = styles.groupBackground; // GroupSummary
            } else if (row.name === "Total Análisis") {
              backgroundClass = styles.summaryBackground; // Summary
            } else if (row.groupTolerance) {
              backgroundClass = styles.groupBackground; // Parámetros del grupo de tolerancia
            }
            
            // Determinar si es la primera fila del grupo de tolerancia
            const isFirstGroupToleranceRow = row.groupTolerance && 
              (idx === 0 || !rows[idx - 1].groupTolerance);
            
            return (
              <TableRow 
                key={row.name} 
                className={row.groupTolerance ? styles.groupBackground : 
                          row.name === "Total granos" ? styles.groupBackground :
                          row.name === "Total Análisis" ? styles.summaryBackground : 
                          styles.whiteBackground}
              >
                <TableCell 
                  className={`${idx === rows.length - 1 ? styles.tableLastRowCell : styles.tableCell}`}
                >
                  {mapConfig[row.name]?.name ?? row.name}
                </TableCell>
                <TableCell 
                  className={`${idx === rows.length - 1 ? styles.tableLastRowCell : styles.tableCell} 
                            ${styles.textRight}`}
                >
                  {typeof row.percent === "number" ? (
                    <>{row.percent.toLocaleString("es-CL")}<span> %</span></>
                  ) : row.percent}
                </TableCell>
                <TableCell 
                  className={`${idx === rows.length - 1 ? styles.tableLastRowCell : styles.tableCell} 
                            ${styles.textRight}`}
                >
                  {typeof row.tolerance === "number" ? (
                    <>{row.tolerance.toLocaleString("es-CL")}<span> %</span></>
                  ) : row.tolerance}
                </TableCell>
                <TableCell 
                  className={`${idx === rows.length - 1 ? styles.tableLastRowCell : styles.tableCell} 
                            ${styles.textRight}`}
                >
                  {typeof row.penalty === "number" ? (
                    <>{row.penalty.toLocaleString("es-CL")}<span> kg</span></>
                  ) : row.penalty}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Resumen final */}
      <Box mt={2} sx={{ width: "35%", display: "grid", gridTemplateColumns: "1fr auto 1fr", rowGap: "1px", alignItems: "center", ml: "auto" }}>
        {(() => {
          const items: { label: string; value: number }[] = [
            { label: "Total descuentos", value: calcPenaltyTotalAnalisis },
            { label: "Bonificación", value: calcPenaltyBonificacion },
          ];
          const bonif = calcPenaltyBonificacion > 0 ? calcPenaltyBonificacion : 0;
          const paddyNet = data.netWeight - calcPenaltyTotalAnalisis + bonif;
          items.push({ label: "Paddy neto", value: paddyNet });

          return items.map(({ label, value }) => (
            <React.Fragment key={label}>
              <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", py: 0 }}>
                <strong>{label}</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "center", py: 0 }}>
                <strong>:</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "right", py: 0 }}>
                {value.toLocaleString("es-CL", {
                  minimumFractionDigits: label === "Paddy neto" ? 2 : 0,
                }).concat(" kg")}
              </Typography>
            </React.Fragment>
          ));
        })()}
      </Box>

      <Divider sx={{ borderBottom: "1px solid #212121", my: 2 }} />

      {/* Observaciones */}
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Box width="50%">
          {/* Título de observaciones */}
          <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: "bold", mb: 1 }}>
            Observaciones:
          </Typography>
          {/* Contenido de observaciones - expandido a lo ancho */}
          <Typography variant="body2" sx={{ fontSize: "12px", textAlign: "left", lineHeight: 1.4 }}>
            {data.note || "Sin observaciones"}
          </Typography>
        </Box>

        <Box width="50%" px={2} py={1} sx={{ border: "0.5px solid #ccc", backgroundColor: "#f9f9f9" }}>
          <Typography fontSize={13} sx={{ textAlign: "justify" }}>
            Arroz Paddy recibido en depósito para posible compra posterior, sin
            responsabilidad para nuestra industria.
          </Typography>
        </Box>
      </Box>

      {/* Firma */}
      <Box textAlign="right" mt={6}>
        <Typography sx={{ fontSize: 12 }}>
          p.p. Sociedad Comercial e Industrial Aparicio y García Limitada
        </Typography>
      </Box>
    </Box>
  );
}
