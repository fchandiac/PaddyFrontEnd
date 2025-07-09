"use client";

import React from "react";
import {
  Box,
  Grid,
  TextField,
  InputAdornment
} from "@mui/material";
import { useReceptionDataEdit } from "@/hooks/useReceptionDataEdit";

export default function GrainAnalysisEdit() {
  const { liveClusters } = useReceptionDataEdit();

  const parameters = [
    { key: "Humedad", label: "Humedad (%)", cluster: liveClusters.Humedad },
    { key: "GranosVerdes", label: "Granos Verdes (%)", cluster: liveClusters.GranosVerdes },
    { key: "Impurezas", label: "Impurezas (%)", cluster: liveClusters.Impurezas },
    { key: "Vano", label: "Vano (%)", cluster: liveClusters.Vano },
    { key: "Hualcacho", label: "Hualcacho (%)", cluster: liveClusters.Hualcacho },
    { key: "GranosManchados", label: "Granos Manchados (%)", cluster: liveClusters.GranosManchados },
    { key: "GranosPelados", label: "Granos Pelados (%)", cluster: liveClusters.GranosPelados },
    { key: "GranosYesosos", label: "Granos Yesosos (%)", cluster: liveClusters.GranosYesosos },
  ];

  return (
    <Box>
      {/* Pesos */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Peso Bruto"
            type="number"
            value={liveClusters.grossWeight.node?.value || 0}
            onChange={(e) => {
              if (liveClusters.grossWeight.node) {
                liveClusters.grossWeight.node.value = Number(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Tara"
            type="number"
            value={liveClusters.tare.node?.value || 0}
            onChange={(e) => {
              if (liveClusters.tare.node) {
                liveClusters.tare.node.value = Number(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Peso Neto"
            type="number"
            value={liveClusters.netWeight.node?.value || 0}
            disabled
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#1976d2",
                fontWeight: "bold"
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Parámetros de análisis */}
      <Grid container spacing={2}>
        {parameters.map((param) => (
          <React.Fragment key={param.key}>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label={param.label}
                type="number"
                value={param.cluster.percent?.value || 0}
                onChange={(e) => {
                  if (param.cluster.percent) {
                    param.cluster.percent.value = Number(e.target.value);
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                size="small"
                label={`Tolerancia ${param.key}`}
                type="number"
                value={param.cluster.tolerance?.value || 0}
                onChange={(e) => {
                  if (param.cluster.tolerance) {
                    param.cluster.tolerance.value = Number(e.target.value);
                  }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label={`Descuento ${param.key}`}
                type="number"
                value={param.cluster.penalty?.value || 0}
                disabled
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                  }
                }}
              />
            </Grid>
          </React.Fragment>
        ))}

        {/* Bonificación y Secado */}
        <Grid item xs={6} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Tolerancia Bonificación"
            type="number"
            value={liveClusters.Bonus.tolerance?.value || 0}
            onChange={(e) => {
              if (liveClusters.Bonus.tolerance) {
                liveClusters.Bonus.tolerance.value = Number(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Secado"
            type="number"
            value={liveClusters.Dry.percent?.value || 0}
            onChange={(e) => {
              if (liveClusters.Dry.percent) {
                liveClusters.Dry.percent.value = Number(e.target.value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            label="Bonificación"
            type="number"
            value={liveClusters.Bonus.penalty?.value || 0}
            disabled
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
