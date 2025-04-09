'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Autocomplete,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { getAllProducers } from '@/app/actions/producer';
import { getAllRiceTypes } from '@/app/actions/rice-type';
import DescuentoPorcentajeCalculator from './ui/GrainAnalysis';
import { useAlertContext } from '@/context/AlertContext';
import { createReception } from '@/app/actions/reception';
import { ReceptionStatus } from '@/types/reception';

export default function NewReceptionPage() {
  const { showAlert } = useAlertContext();

  const [producers, setProducers] = useState<any[]>([]);
  const [riceTypes, setRiceTypes] = useState<any[]>([]);

  const [producer, setProducer] = useState<any>(null);
  const [riceType, setRiceType] = useState<any>(null);

  const [price, setPrice] = useState('');
  const [guide, setGuide] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [tare, setTare] = useState('');

  const netWeight = Math.max(
    0,
    parseFloat(grossWeight) - parseFloat(tare) || 0
  );

  const [resumen, setResumen] = useState<any>({
    humedad: 0,
    granosVerdes: 0,
    impurezas: 0,
    granosManchados: 0,
    hualcacho: 0,
    granosPelados: 0,
    granosYesosos: 0,
    bonificacion: 0,
    secado: 0,
    totalDescuento: 0,
    totalBonificacion: 0,
  });

  const totalConDescuentos = Math.max(
    0,
    netWeight - resumen.totalDescuento + resumen.totalBonificacion
  );

  const totalAPagar = totalConDescuentos * (parseFloat(price) || 0);

  useEffect(() => {
    const loadData = async () => {
      const [producerData, riceTypeData] = await Promise.all([
        getAllProducers(),
        getAllRiceTypes(),
      ]);
      setProducers(producerData);
      setRiceTypes(riceTypeData);
    };

    loadData();
  }, []);

  const handleSave = async () => {
    if (!producer || !riceType || !price || !guide || !licensePlate || !grossWeight || !tare) {
      showAlert('Por favor complete todos los campos obligatorios.', 'error');
      return;
    }

    const payload = {
      producerId: producer.id,
      riceTypeId: riceType.id,
      price: parseFloat(price),
      guide,
      licensePlate,
      grossWeight: parseFloat(grossWeight),
      tare: parseFloat(tare),
      netWeight,
      humedad: resumen.humedad,
      granosVerdes: resumen.granosVerdes,
      impurezas: resumen.impurezas,
      granosManchados: resumen.granosManchados,
      hualcacho: resumen.hualcacho,
      granosPelados: resumen.granosPelados,
      granosYesosos: resumen.granosYesosos,
      bonificacion: resumen.bonificacion,
      secado: resumen.secado,
      status: 'pending' as ReceptionStatus,
    };

    try {
      await createReception(payload);
      showAlert('Recepción guardada exitosamente.', 'success');
    } catch (error) {
      showAlert('Error al guardar la recepción.', 'error');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={6}>
          <Typography gutterBottom>
            Datos de la recepción y Análisis de granos
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={producers}
                getOptionLabel={(option) => `${option.rut} - ${option.name}`}
                value={producer}
                onChange={(_, newValue) => setProducer(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Productor"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                options={riceTypes}
                getOptionLabel={(option) => option.name}
                value={riceType}
                onChange={(_, newValue) => {
                  setRiceType(newValue);
                  if (newValue?.price) {
                    setPrice(newValue.price.toString());
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo de arroz"
                    fullWidth
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Precio"
                type="number"
                fullWidth
                size="small"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Guía"
                fullWidth
                size="small"
                value={guide}
                onChange={(e) => setGuide(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Placa"
                fullWidth
                size="small"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Peso bruto"
                type="number"
                fullWidth
                size="small"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Tara"
                type="number"
                fullWidth
                size="small"
                value={tare}
                onChange={(e) => setTare(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Peso neto"
                type="number"
                fullWidth
                size="small"
                value={netWeight}
                InputProps={{ readOnly: true, sx: { textAlign: 'right' } }}
                sx={{ textAlign: 'right' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  bgcolor: '#f7f7f7',
                  p: 2,
                  borderRadius: 2,
                  mt: 1,
                  border: '1px solid #ccc',
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Resumen de cálculo
                </Typography>

                <Typography variant="caption">Kg Bruto: {grossWeight || '0'}</Typography><br />
                <Typography variant="caption">Tara: {tare || '0'}</Typography><br />
                <Typography variant="caption">Peso neto: {netWeight}</Typography><br />

                <Typography variant="caption" color="error">
                  Total descuento: {resumen.totalDescuento.toFixed(2)} kg
                </Typography><br />

                <Typography variant="caption" color="primary">
                  Bonificación: {resumen.totalBonificacion.toFixed(2)} kg
                </Typography><br />

                <Typography variant="caption" fontWeight="bold">
                  Total con descuentos: {totalConDescuentos.toFixed(2)} kg
                </Typography><br />

                <Typography variant="caption" fontWeight="bold" color="green">
                  Total a pagar: ${totalAPagar.toFixed(2)}
                </Typography><br />

                <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 1 }}>
                  Secado: {resumen.secado.toFixed(2)} kg
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
              >
                Guardar recepción
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={6}>
          <DescuentoPorcentajeCalculator
            netWeight={netWeight}
            onResumenChange={setResumen}
          />
        </Grid>
      </Grid>
    </Box>
  );
}