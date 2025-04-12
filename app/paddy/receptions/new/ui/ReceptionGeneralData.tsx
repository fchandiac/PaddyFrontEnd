"use client";

import {
  Autocomplete,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getAllProducers } from "@/app/actions/producer";
import { getAllRiceTypes } from "@/app/actions/rice-type";
import { useReceptionContext } from "@/context/ReceptionDataContext";

export default function ReceptionGeneralData() {
  const {
    data,
    setProducerId,
    setRiceTypeId,
    setPrice,
    setGuide,
    setLicensePlate,
    setGrossWeight,
    setTare,
    setNote,
  } = useReceptionContext();

  const [producers, setProducers] = useState<any[]>([]);
  const [riceTypes, setRiceTypes] = useState<any[]>([]);

  const [priceInput, setPriceInput] = useState(data.price.toString());
  const [grossWeightInput, setGrossWeightInput] = useState(data.grossWeight.toString());
  const [tareInput, setTareInput] = useState(data.tare.toString());

  const priceInputRef = useRef<HTMLInputElement>(null);

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

  const selectedProducer = producers.find((p) => p.id === data.producerId) || null;
  const selectedRiceType = riceTypes.find((r) => r.id === data.riceTypeId) || null;

  const formatPriceInput = (value: number) => {
    return value.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    });
  };

  const handleBlurPrice = () => {
    const parsed = parseFloat(priceInput);
    if (!isNaN(parsed)) {
      const formatted = formatPriceInput(parsed);
      setPriceInput(formatted);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Autocomplete
          options={producers}
          getOptionLabel={(option) => `${option.rut} - ${option.name}`}
          value={selectedProducer}
          onChange={(_, newValue) => setProducerId(newValue?.id || 0)}
          renderInput={(params) => (
            <TextField {...params} label="Productor" fullWidth size="small" />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <Autocomplete
          options={riceTypes}
          getOptionLabel={(option) => option.name}
          value={selectedRiceType}
          onChange={(_, newValue) => {
            setRiceTypeId(newValue?.id || 0);
            if (newValue?.price !== undefined) {
              setPrice(newValue.price);
              setPriceInput(newValue.price.toString());

              // 👉 Simula blur al campo precio
              setTimeout(() => {
                priceInputRef.current?.blur();
              }, 0);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Tipo de arroz" fullWidth size="small" />
          )}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Precio"
          type="text"
          fullWidth
          size="small"
          inputRef={priceInputRef}
          value={priceInput}
          onChange={(e) => {
            const val = e.target.value
              .replace(/\$/g, "")
              .replace(/\./g, "")
              .replace(/,/g, ".");
            setPriceInput(val);
            const parsed = parseFloat(val);
            if (!isNaN(parsed)) setPrice(parsed);
          }}
          onBlur={handleBlurPrice}
          onFocus={() => {
            setPriceInput(data.price.toString());
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Guía"
          fullWidth
          size="small"
          value={data.guide}
          onChange={(e) => setGuide(e.target.value)}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Placa"
          fullWidth
          size="small"
          value={data.licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Peso bruto"
          type="number"
          fullWidth
          size="small"
          value={grossWeightInput}
          onChange={(e) => {
            const val = e.target.value;
            setGrossWeightInput(val);
            const parsed = parseFloat(val);
            if (!isNaN(parsed)) setGrossWeight(parsed);
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Tara"
          type="number"
          fullWidth
          size="small"
          value={tareInput}
          onChange={(e) => {
            const val = e.target.value;
            setTareInput(val);
            const parsed = parseFloat(val);
            if (!isNaN(parsed)) setTare(parsed);
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Peso neto"
          type="number"
          fullWidth
          size="small"
          value={data.netWeight}
          InputProps={{
            readOnly: true,
            sx: { textAlign: "right" },
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          sx={{ textAlign: "right" }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Observaciones"
          multiline
          rows={3}
          fullWidth
          size="small"
          value={data.note || ""}
          onChange={(e) => setNote(e.target.value)}
        />
      </Grid>
    </Grid>
  );
}
