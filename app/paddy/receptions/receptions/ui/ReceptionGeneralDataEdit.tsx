"use client";

import React from "react";
import {
  Box,
  TextField,
  Grid,
  InputAdornment
} from "@mui/material";
import { useReceptionDataEdit } from "@/hooks/useReceptionDataEdit";

export default function ReceptionGeneralDataEdit() {
  const { data, setField } = useReceptionDataEdit();

  return (
    <Box>
      <Grid container spacing={1} sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        gridTemplateRows: { md: 'repeat(3, 1fr)' },
        gap: 1,
        alignItems: 'start'
      }}>
        {/* Primera fila */}
        {/* Productor */}
        <Box sx={{ gridColumn: { xs: '1', md: '1' }, gridRow: { md: '1' } }}>
          <TextField
            fullWidth
            size="small"
            label="Productor"
            value={data.producer?.name || "Sin productor"}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              }
            }}
          />
        </Box>

        {/* Guía */}
        <Box sx={{ gridColumn: { xs: '1', md: '2' }, gridRow: { md: '1' } }}>
          <TextField
            fullWidth
            size="small"
            label="Guía"
            value={data.guide || ""}
            onChange={(e) => setField("guide", e.target.value)}
          />
        </Box>

        {/* Peso bruto */}
        <Box sx={{ gridColumn: { xs: '1', md: '3' }, gridRow: { md: '1' } }}>
          <TextField
            fullWidth
            size="small"
            label="Peso bruto"
            type="number"
            value={data.grossWeight || 0}
            onChange={(e) => setField("grossWeight", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </Box>

        {/* Observaciones - ocupando 3 filas */}
        <Box sx={{ 
          gridColumn: { xs: '1', md: '4' }, 
          gridRow: { xs: 'auto', md: '1 / 4' },
          height: { md: '100%' }
        }}>
          <TextField
            fullWidth
            size="small"
            label="Nota/Observación"
            value={data.note || ""}
            onChange={(e) => setField("note", e.target.value)}
            multiline
            minRows={6}
            maxRows={8}
            sx={{ 
              height: { md: '100%' },
              '& .MuiInputBase-root': {
                height: { md: '100%' },
                alignItems: 'flex-start'
              },
              '& .MuiInputBase-input': {
                height: { md: '100% !important' },
                overflow: 'auto !important'
              }
            }}
          />
        </Box>

        {/* Segunda fila */}
        {/* Tipo de arroz */}
        <Box sx={{ gridColumn: { xs: '1', md: '1' }, gridRow: { md: '2' } }}>
          <TextField
            fullWidth
            size="small"
            label="Tipo de arroz"
            value={data.riceType?.name || "Sin tipo"}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              }
            }}
          />
        </Box>

        {/* Placa patente */}
        <Box sx={{ gridColumn: { xs: '1', md: '2' }, gridRow: { md: '2' } }}>
          <TextField
            fullWidth
            size="small"
            label="Patente"
            value={data.licensePlate || ""}
            onChange={(e) => setField("licensePlate", e.target.value)}
          />
        </Box>

        {/* Tara */}
        <Box sx={{ gridColumn: { xs: '1', md: '3' }, gridRow: { md: '2' } }}>
          <TextField
            fullWidth
            size="small"
            label="Tara"
            type="number"
            value={data.tare || 0}
            onChange={(e) => setField("tare", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </Box>

        {/* Tercera fila */}
        {/* Precio */}
        <Box sx={{ gridColumn: { xs: '1', md: '1' }, gridRow: { md: '3' } }}>
          <TextField
            fullWidth
            size="small"
            label="Precio"
            type="number"
            value={data.price || 0}
            onChange={(e) => setField("price", Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Box>

        {/* Espacio en blanco */}
        <Box sx={{ gridColumn: { xs: '1', md: '2' }, gridRow: { md: '3' } }}>
          {/* Espacio vacío */}
        </Box>

        {/* Peso neto */}
        <Box sx={{ gridColumn: { xs: '1', md: '3' }, gridRow: { md: '3' } }}>
          <TextField
            fullWidth
            size="small"
            label="Peso neto"
            type="number"
            value={data.netWeight || 0}
            disabled
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              }
            }}
          />
        </Box>
      </Grid>
    </Box>
  );
}
