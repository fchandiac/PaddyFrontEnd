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

// Create a ref to access the component from outside
export const producerInputRef = { current: null as HTMLInputElement | null };

export function focusOnProducer(): void {
  if (producerInputRef.current) {
    producerInputRef.current.focus();
    // También intenta seleccionar el texto si es posible
    if (producerInputRef.current.select) {
      producerInputRef.current.select();
    }
    console.log("Productor enfocado correctamente");
  } else {
    console.log("No se pudo enfocar el productor: producerInputRef.current es null");
    // Intento alternativo usando setTimeout y querySelector
    setTimeout(() => {
      if (producerInputRef.current) {
        producerInputRef.current.focus();
        console.log("Productor enfocado con retraso");
      } else {
        // Último intento usando querySelector como fallback
        const producerInput = document.querySelector('input[aria-label="Productor"]') as HTMLInputElement;
        if (producerInput) {
          producerInput.focus();
          if (producerInput.select) {
            producerInput.select();
          }
          console.log("Productor enfocado usando querySelector");
        } else {
          console.log("No se pudo enfocar el productor incluso con querySelector");
        }
      }
    }, 500);
  }
}

export default function ReceptionGeneralData() {
  const { data, liveClusters, setField } = useReceptionContext();

  const [producers, setProducers] = useState<any[]>([]);
  const [riceTypes, setRiceTypes] = useState<any[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [loadingProducers, setLoadingProducers] = useState(true);
  const [loadingRiceTypes, setLoadingRiceTypes] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<any>(null);
  const [inputValue, setInputValue] = useState('');
  const [highlightedOption, setHighlightedOption] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isRiceTypeOpen, setIsRiceTypeOpen] = useState(false);
  const [riceTypeHighlighted, setRiceTypeHighlighted] = useState<any>(null);
  
  // Refs para manejar el foco entre campos
  const producerRef = useRef<HTMLInputElement | null>(null);
  const riceTypeRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const guideRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const grossWeightRef = useRef<HTMLInputElement>(null);
  const tareRef = useRef<HTMLInputElement>(null);
  const netWeightRef = useRef<HTMLInputElement>(null);
  const observationsRef = useRef<HTMLInputElement>(null);
  
  // Función para manejar navegación con Enter
  const handleEnterNavigation = (nextRef: React.RefObject<HTMLInputElement>) => {
    setTimeout(() => {
      if (nextRef.current) {
        nextRef.current.focus();
        // Seleccionar el texto si existe
        if (nextRef.current.select) {
          nextRef.current.select();
        }
      }
    }, 50);
  };

  const fetchProducers = async () => {
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

  // Función para foco en el productor - exportada para uso externo
  const focusOnProducer = () => {
    if (producerRef.current) {
      producerRef.current.focus();
    }
  };

  // Enfocar automáticamente el campo del productor cuando se carga la página
  useEffect(() => {
    const timer = setTimeout(() => {
      focusOnProducer();
    }, 300); // Pequeño delay para asegurar que el componente esté completamente renderizado

    return () => clearTimeout(timer);
  }, []);

  // Sincronizar el precio con el contexto
  useEffect(() => {
    console.log('💰 DEBUG - Sincronizando precio local con contexto:', data.price, 'tipo:', typeof data.price);
    setPrice(data.price || 0);
  }, [data.price]);

  // Desactivar foco en botones internos de autocomplete (solo Tab, no Enter)
  useEffect(() => {
    const disableAutocompleteButtonTabFocus = () => {
      const autocompleteButtons = document.querySelectorAll('.MuiAutocomplete-endAdornment button');
      autocompleteButtons.forEach((button) => {
        (button as HTMLElement).tabIndex = -1;
        // Solo interceptar Tab, no Enter
        button.addEventListener('keydown', (e: Event) => {
          const keyboardEvent = e as KeyboardEvent;
          if (keyboardEvent.key === 'Tab') {
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
        });
      });
    };

    // Ejecutar después de que se rendericen los componentes
    const timer = setTimeout(disableAutocompleteButtonTabFocus, 100);
    
    return () => clearTimeout(timer);
  }, [producers, riceTypes]);

  // Sincronizar el productor seleccionado con el contexto
  useEffect(() => {
    const currentProducer = producers.find((p) => p.id === data.producerId);
    setSelectedProducer(currentProducer || null);
    
    // Actualizar inputValue cuando cambia el productor seleccionado
    if (currentProducer) {
      setInputValue(`${currentProducer.rut} - ${currentProducer.name}`);
    } else {
      setInputValue('');
    }
  }, [data.producerId, producers]);

  return (
    <>
      <Grid container spacing={1.3}>
        {/* Productor */}
        <Grid item xs={12}>
          <Autocomplete
            options={[...producers, { id: "__add_new__", name: "Agregar nuevo productor", rut: "" }]}
            autoHighlight
            noOptionsText="No se encontraron resultados"
            loading={loadingProducers}
            loadingText="Cargando productores..."
            inputValue={inputValue}
            open={isOpen}
            onOpen={() => setIsOpen(true)}
            onClose={() => {
              setIsOpen(false);
              setHighlightedOption(null);
            }}
            disableClearable={false}
            slotProps={{
              popupIndicator: {
                tabIndex: -1,
                sx: { '&:focus': { outline: 'none' } }
              },
              clearIndicator: {
                tabIndex: -1,
                sx: { '&:focus': { outline: 'none' } }
              },
            }}
            onInputChange={(_, newInputValue, reason) => {
              setInputValue(newInputValue);
              
              // Si el usuario presiona Enter y la opción resaltada es "agregar nuevo"
              if (reason === 'input' && newInputValue === "➕ Agregar nuevo productor") {
                setOpenDialog(true);
                setSelectedProducer(null);
                setInputValue('');
              }
            }}
            filterOptions={(options, { inputValue }) => {
              // Filtrar productores normalmente
              const filtered = options.filter((option) => {
                if (option.id === "__add_new__") return false; // No mostrar la opción "agregar" en el filtro normal
                const searchTerm = inputValue.toLowerCase();
                return (
                  option.name?.toLowerCase().includes(searchTerm) ||
                  option.rut?.toLowerCase().includes(searchTerm) ||
                  option.businessName?.toLowerCase().includes(searchTerm)
                );
              });
              
              // Si no hay resultados y hay texto de búsqueda, mostrar la opción "agregar nuevo"
              if (filtered.length === 0 && inputValue.trim()) {
                return [{ id: "__add_new__", name: "Agregar nuevo productor", rut: "" }];
              }
              
              // Si hay resultados, mostrar los resultados + opción agregar
              return [...filtered, { id: "__add_new__", name: "Agregar nuevo productor", rut: "" }];
            }}
            getOptionLabel={(option) =>
              option.id === "__add_new__"
                ? "➕ Agregar nuevo productor"
                : `${option.rut} - ${option.name}`
            }
            value={selectedProducer}
            onChange={(_, newValue, reason) => {
              if (newValue?.id === "__add_new__") {
                setOpenDialog(true);
                setSelectedProducer(null);
                setInputValue('');
              } else {
                setSelectedProducer(newValue);
                if (newValue) {
                  // Actualizar contexto con datos del productor
                  setField('producerId', newValue.id);
                  setField('producerName', newValue.name);
                  setField('producerBusinessName', newValue.businessName || '');
                  setField('producerRut', newValue.rut);
                  setField('producerAddress', newValue.address || '');
                  setInputValue(`${newValue.rut} - ${newValue.name}`);
                } else {
                  // Limpiar datos del productor
                  setField('producerId', 0);
                  setField('producerName', '');
                  setField('producerBusinessName', '');
                  setField('producerRut', '');
                  setField('producerAddress', '');
                  setInputValue('');
                }
              }
            }}
            onHighlightChange={(_, option) => {
              setHighlightedOption(option);
            }}
            renderOption={(props, option) => {
              // Extract key from props to avoid React warning
              const { key, ...otherProps } = props;
              return (
                <Box key={key} component="li" {...otherProps}>
                  {option.id === "__add_new__" ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      color: 'primary.main', 
                      fontWeight: 500,
                      py: 1,
                      borderTop: '1px solid #e0e0e0',
                      width: '100%'
                    }}>
                      <span>➕</span>
                      <span>Agregar nuevo productor</span>
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ fontWeight: 500 }}>{option.name}</Box>
                      <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {option.rut} {option.businessName && `• ${option.businessName}`}
                      </Box>
                    </Box>
                  )}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={(el) => {
                  // Asignar ambas referencias al mismo elemento
                  if (el) {
                    producerRef.current = el;
                    producerInputRef.current = el;
                  }
                }}
                label="Productor"
                fullWidth
                size="small"
                placeholder="Buscar por nombre, RUT o razón social..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    // Si el dropdown está abierto y hay una opción resaltada (navegando por opciones)
                    if (isOpen && highlightedOption) {
                      // Si es la opción "Agregar nuevo productor"
                      if (highlightedOption.id === "__add_new__") {
                        event.preventDefault();
                        event.stopPropagation();
                        setOpenDialog(true);
                        setSelectedProducer(null);
                        setInputValue('');
                        setIsOpen(false);
                        return;
                      }
                      // Para opciones normales de productor, permitir comportamiento por defecto
                      // (el autocomplete se encargará de la selección)
                      return;
                    }
                    
                    // Si ya hay un productor seleccionado y el dropdown no está abierto
                    if (selectedProducer && !isOpen) {
                      event.preventDefault();
                      event.stopPropagation();
                      handleEnterNavigation(riceTypeRef);
                      return;
                    }
                  }
                  
                  // Prevenir que Tab navegue a botones internos solo si hay productor seleccionado
                  if (event.key === 'Tab' && !event.shiftKey && selectedProducer && !isOpen) {
                    event.preventDefault();
                    handleEnterNavigation(riceTypeRef);
                  }
                }}
                sx={{
                  '& .MuiAutocomplete-endAdornment button': {
                    tabIndex: -1,
                    '&:focus': {
                      outline: 'none',
                      backgroundColor: 'transparent'
                    }
                  }
                }}
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
            open={isRiceTypeOpen}
            onOpen={() => setIsRiceTypeOpen(true)}
            onClose={() => {
              setIsRiceTypeOpen(false);
              setRiceTypeHighlighted(null);
            }}
            onHighlightChange={(_, option) => {
              setRiceTypeHighlighted(option);
            }}
            disableClearable={false}
            slotProps={{
              popupIndicator: {
                tabIndex: -1,
                sx: { '&:focus': { outline: 'none' } }
              },
              clearIndicator: {
                tabIndex: -1,
                sx: { '&:focus': { outline: 'none' } }
              },
            }}
            onChange={(_, newValue) => {
              setField('riceTypeId', newValue?.id || 0);
              if (newValue?.price != null) {
                console.log('🔥 DEBUG - Asignando precio desde tipo de arroz:', newValue.price, 'Tipo:', newValue.name, 'Tipo del precio:', typeof newValue.price);
                
                // Asegurar que el precio sea número
                const numericPrice = typeof newValue.price === 'string' ? parseFloat(newValue.price) : newValue.price;
                const finalPrice = isNaN(numericPrice) ? 0 : numericPrice;
                
                console.log('🔢 DEBUG - Precio convertido:', finalPrice, 'Tipo:', typeof finalPrice);
                
                setPrice(finalPrice);
                // ✅ SOLUCIÓN: También actualizar el contexto con el nuevo precio
                setField("price", finalPrice);
                console.log('✅ DEBUG - Precio actualizado en contexto:', finalPrice);
                
                // Verificar inmediatamente si el valor se guardó en el contexto
                setTimeout(() => {
                  console.log('🕐 DEBUG - Verificando precio en contexto después de 100ms:', data.price);
                }, 100);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={riceTypeRef}
                label="Tipo de arroz"
                fullWidth
                size="small"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    // Si el dropdown está abierto y hay una opción resaltada (navegando por opciones)
                    if (isRiceTypeOpen && riceTypeHighlighted) {
                      // Permitir comportamiento por defecto (selección normal)
                      return;
                    }
                    
                    // Si ya hay un tipo de arroz seleccionado y el dropdown no está abierto
                    if (riceTypes.find((r) => r.id === data.riceTypeId) && !isRiceTypeOpen) {
                      event.preventDefault();
                      event.stopPropagation();
                      handleEnterNavigation(priceRef);
                    }
                  }
                  
                  // Prevenir que Tab navegue a botones internos solo si hay valor seleccionado
                  if (event.key === 'Tab' && !event.shiftKey && riceTypes.find((r) => r.id === data.riceTypeId) && !isRiceTypeOpen) {
                    event.preventDefault();
                    handleEnterNavigation(priceRef);
                  }
                }}
                sx={{
                  '& .MuiAutocomplete-endAdornment button': {
                    tabIndex: -1,
                    '&:focus': {
                      outline: 'none',
                      backgroundColor: 'transparent'
                    }
                  }
                }}
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
            inputRef={priceRef}
            label="Precio ($/kg)"
            type="text"
            autoComplete="off"
            fullWidth
            size="small"
            value={
              price 
                ? price.toLocaleString('es-CL', { 
                    minimumFractionDigits: 0 
                  }) 
                : ''
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const rawValue = e.target.value;
              // Eliminar caracteres no numéricos
              const numericValue = rawValue.replace(/[^\d]/g, '');
              if (numericValue) {
                const parsedValue = parseInt(numericValue, 10);
                setPrice(parsedValue);
                // Update context with the new price
                setField("price", parsedValue);
              } else {
                setPrice(0);
                // Update context with 0 price
                setField("price", 0);
              }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.target as HTMLInputElement).select()}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleEnterNavigation(guideRef);
              }
            }}
          />
        </Grid>

        {/* Guía */}
        <Grid item xs={6}>
          <TextField
            inputRef={guideRef}
            label="Guía"
            fullWidth
            size="small"
            value={data.guide || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("guide", e.target.value)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleEnterNavigation(licenseRef);
              }
            }}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Placa patente */}
        <Grid item xs={6}>
          <TextField
            inputRef={licenseRef}
            label="Placa patente"
            autoComplete="off"
            fullWidth
            size="small"
            value={data.licensePlate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("licensePlate", e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEnterNavigation(grossWeightRef);
              }
            }}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Peso bruto */}
        <Grid item xs={6}>
          <TextField
            inputRef={grossWeightRef}
            label="Peso bruto"
            type="number"
            fullWidth
            size="small"
            value={liveClusters.grossWeight.node.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              liveClusters.grossWeight.node.onChange(parseFloat(e.target.value));
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEnterNavigation(tareRef);
              }
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Tara */}
        <Grid item xs={6}>
          <TextField
            inputRef={tareRef}
            label="Tara"
            type="number"
            fullWidth
            size="small"
            value={liveClusters.tare.node.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              liveClusters.tare.node.onChange(parseFloat(e.target.value));
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEnterNavigation(observationsRef);
              }
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Peso neto (calculado) - Sin navegación con Enter */}
        <Grid item xs={12}>
          <TextField
            inputRef={netWeightRef}
            label="Peso neto"
            type="number"
            fullWidth
            size="small"
            value={liveClusters.netWeight.node.value}
            InputProps={{
              readOnly: true,
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              sx: { "& input": { textAlign: "right" } },
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => (e.target as HTMLInputElement).select()}
          />
        </Grid>

        {/* Observaciones */}
        <Grid item xs={12}>
          <TextField
            inputRef={observationsRef}
            label="Observaciones"
            multiline
            rows={3}
            fullWidth
            size="small"
            value={data.note}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("note", e.target.value)}
            onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
              // Seleccionar todo el texto cuando se recibe el foco
              setTimeout(() => {
                (e.target as HTMLInputElement).select();
              }, 10);
            }}
          />
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          // Restaurar el inputValue al cerrar sin crear
          const currentProducer = producers.find((p) => p.id === data.producerId);
          if (currentProducer) {
            setInputValue(`${currentProducer.rut} - ${currentProducer.name}`);
          } else {
            setInputValue('');
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <CreateProducerForm
            afterSubmit={async (newProducer?: any) => {
              // Actualizar lista de productores
              await fetchProducers();
              
              // Si se proporcionó el nuevo productor, seleccionarlo automáticamente
              if (newProducer) {
                setSelectedProducer(newProducer);
                setField('producerId', newProducer.id);
                setField('producerName', newProducer.name);
                setField('producerBusinessName', newProducer.businessName || '');
                setField('producerRut', newProducer.rut);
                setField('producerAddress', newProducer.address || '');
                setInputValue(`${newProducer.rut} - ${newProducer.name}`);
              }
              
              setOpenDialog(false);
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
