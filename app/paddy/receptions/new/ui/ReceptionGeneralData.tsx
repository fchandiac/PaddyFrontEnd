"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  Box,
  CircularProgress,
} from "@mui/material";
import { getAllProducers } from "@/app/actions/producer";
import { getAllRiceTypes } from "@/app/actions/rice-type";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { CreateProducerForm } from "@/app/paddy/producers/producers/ui/CreateProducerForm";



export default function ReceptionGeneralData() {
  const { data, liveClusters } = useReceptionContext();

  const [producers, setProducers] = useState<any[]>([]);
  const [riceTypes, setRiceTypes] = useState<any[]>([]);
  const [loadingProducers, setLoadingProducers] = useState(true);
  const [loadingRiceTypes, setLoadingRiceTypes] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const  fetchProducers = async () => {
    setLoadingProducers(true);
    const producers = await getAllProducers();
    setProducers(producers);
    setLoadingProducers(false);
  }

  const fetchRiceTypes = async () => {
    setLoadingRiceTypes(true);
    const riceTypes = await getAllRiceTypes();
    setRiceTypes(riceTypes);
    setLoadingRiceTypes(false);
  }



  useEffect(() => {

    fetchProducers();
    fetchRiceTypes();
    
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        {/* Productor */}
        <Grid item xs={12}>
          <Autocomplete
            options={[...producers, { id: "__add_new__", name: "", rut: "" }]}
            autoHighlight
            noOptionsText="No se encontraron resultados"
            loading={loadingProducers}
            loadingText="Cargando productores..."
            getOptionLabel={(option) =>
              option.id === "__add_new__"
                ? "➕ Agregar nuevo productor"
                : `${option.rut} - ${option.name}`
            }
            value={producers.find((p) => p.id === data.producerId) || null}
            onChange={(_, newValue) => {
              if (newValue?.id === "__add_new__") {
                // setOpenDialog(true);
              } else {
                // setProducerId(newValue?.id || 0);
         
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Productor"
                fullWidth
                size="small"
                // inputRef={producerAutocompleteRef}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingProducers && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Tipo de arroz */}
        <Grid item xs={6}>
          <Autocomplete
            options={riceTypes}
            autoHighlight
            noOptionsText="No se encontraron resultados"
            loading={loadingRiceTypes}
            loadingText="Cargando tipos de arroz..."
            getOptionLabel={(option) => `${option.id} - ${option.name}`}
            value={riceTypes.find((r) => r.id === data.riceTypeId) || null}
            onChange={(_, newValue) => {
              // setRiceTypeId(newValue?.id || 0);

              if (newValue?.price != null) {
                // setPriceInput(newValue.price.toString());
                // setParamTable("price" as ParamKey, newValue.price);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de arroz"
                fullWidth
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingRiceTypes && <CircularProgress size={20} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>

        {/* Precio */}
        <Grid item xs={6}>
          <TextField
            label="Precio ($/kg)"
            type="text"
            autoComplete="off"
            fullWidth
            size="small"
            // inputRef={priceInputRef}
            value={liveClusters.price.node.value}
            onChange={(e) => {
              const v = e.target.value;
            
            }}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Guía */}
        <Grid item xs={6}>
          <TextField
            label="Guía"
            fullWidth
            size="small"
            // value={guideInput}
            // onChange={(e) => setGuideInput(e.target.value)}
            // onBlur={() =>  setGuide(guideInput)}
            // onFocus={(e) => (e.target as HTMLInputElement).select()}
           
          />
        </Grid>

        {/* Placa patente */}
        <Grid item xs={6}>
          <TextField
            label="Placa patente"
            autoComplete="off"
            fullWidth
            size="small"
            // value={licenseInput}
            // onChange={(e) => setLicenseInput(e.target.value)}
            // onBlur={() => setLicensePlate(licenseInput)}
            // onFocus={(e) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Peso bruto */}
        <Grid item xs={6}>
          <TextField
            label="Peso bruto"
            type="number"
            fullWidth
            size="small"
            value={liveClusters.grossWeight.node.value}
            onChange={(e) => {
              liveClusters.grossWeight.node.onChange(parseFloat(e.target.value));
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Tara */}
        <Grid item xs={6}>
          <TextField
            label="Tara"
            type="number"
            fullWidth
            size="small"
            value={liveClusters.tare.node.value}
            onChange={(e) => {
              liveClusters.tare.node.onChange(parseFloat(e.target.value));
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Peso neto (calculado) */}
        <Grid item xs={12}>
          <TextField
            label="Peso neto"
            type="number"
            fullWidth
            size="small"
            value={liveClusters.netWeight.node.value}
            InputProps={{
              readOnly: true,
              tabIndex: -1,
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              sx: { "& input": { textAlign: "right" } },
            }}
          />
        </Grid>

        {/* Observaciones */}
        <Grid item xs={12}>
          <TextField
            label="Observaciones"
            multiline
            rows={3}
            fullWidth
            size="small"
            // value={noteInput}
            // onChange={(e) => setNoteInput(e.target.value)}

          />
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <CreateProducerForm
            afterSubmit={async () => {
              const updated = await getAllProducers();
              setProducers(updated);
              setOpenDialog(false);
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
