"use client";

import { useState, useRef, useEffect } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import {
  createProducer,
  createProducerWithBankAccount,
} from "@/app/actions/producer";
import { useAlertContext } from "@/context/AlertContext";
import { createRecord } from "@/app/actions/record";
import { useUserContext } from "@/context/UserContext";
import { createTransaction } from "@/app/actions/transaction";
import { TransactionTypeCode } from "@/types/transaction";
import { bankOptions, accountBankTypes } from "@/types/producer";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { usePathname } from "next/navigation";
import {
  Grid,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Stack,
  Divider,
  InputAdornment,
  Box,
} from "@mui/material";


const initialForm = {
  name: "",
  businessName: "",
  rut: "",
  address: "",
  phone: "",
  bank: "",
  accountType: "",
  accountNumber: "",
  holderName: "",
};

export const CreateProducerForm = ({
  afterSubmit,
}: {
  afterSubmit: (newProducer?: any) => void;
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();
  const pathname = usePathname();

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const isBankAccountComplete = () => {
    const { bank, accountNumber, accountType, holderName } = formData;
    return bank && accountNumber && accountType && holderName;
  };

  // Función para manejar el cambio de nombre y auto-completar otros campos
  const handleNameChange = (value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        name: value,
      };
      
      // Solo copiar si los campos están vacíos (no han sido modificados por el usuario)
      if (prev.businessName === "" || prev.businessName === prev.name) {
        newData.businessName = value;
      }
      
      if (prev.holderName === "" || prev.holderName === prev.name) {
        newData.holderName = value;
      }
      
      return newData;
    });
  };

  // Función para manejar cambios en otros campos
  const handleFieldChange = (field: string, value: any) => {
    if (field === "name") {
      handleNameChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveProducer = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      let result;

      if (isBankAccountComplete()) {
        result = await createProducerWithBankAccount(formData);
      } else {
        const { bank, accountNumber, accountType, holderName, ...rest } =
          formData;
        result = await createProducer(rest);
      }

      if (result?.error) {
        setErrors(
          Array.isArray(result.message) ? result.message : [result.error]
        );
        return;
      }

      await createRecord({
        userId: user?.id ?? null,
        entity: "productores",
        description: `Creación de productor ${formData.name} (${formData.rut})`,
      });

      await createTransaction({
        userId: user?.id ?? 0,
        producerId: result.id,
        typeCode: TransactionTypeCode.OPEN_ACCOUNT,
        debit: 0,
        credit: 0,
        balance: 0,
        previousBalance: 0,
        description: "Apertura de cuenta",
        lastTransaction: null,
        isDraft: false,
      });

      showAlert("Productor creado correctamente", "success");

      afterSubmit(result); // Pasar el productor creado
      setFormData(initialForm);
    } catch (err) {
      setErrors(["Error inesperado al guardar el productor"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveProducer();
        }}
      >
        <Grid container spacing={2} direction="column">
          {/* Título */}
          <Grid item>
            <Typography variant="h6">Nuevo Productor</Typography>
          </Grid>

          {/* Errores */}
          {errors.length > 0 && (
            <Grid item>
              <Stack spacing={1}>
                {errors.map((err, i) => (
                  <Alert severity="error" key={i}>
                    {err}
                  </Alert>
                ))}
              </Stack>
            </Grid>
          )}

          {/* Nombre */}
          <Grid item>
            <TextField
              label="Nombre"
              variant="outlined"
              size="small"
              required
              fullWidth
              inputRef={nameInputRef}
              value={formData.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              autoComplete="off"
            />
          </Grid>

          {/* Razón Social */}
          <Grid item>
            <TextField
              label="Razón Social"
              variant="outlined"
              size="small"
              required
              fullWidth
              value={formData.businessName || ""}
              onChange={(e) => handleFieldChange("businessName", e.target.value)}
              autoComplete="off"
            />
          </Grid>

          {/* RUT */}
          <Grid item>
            <TextField
              label="RUT"
              variant="outlined"
              size="small"
              required
              fullWidth
              value={formData.rut || ""}
              onChange={(e) => {
                const cleaned = e.target.value
                  .toUpperCase()
                  .replace(/[^0-9K]/g, "")
                  .slice(0, 9);
                let formatted = cleaned;
                if (cleaned.length > 1) {
                  const body = cleaned.slice(0, -1);
                  const dv = cleaned.slice(-1);
                  formatted = `${body}-${dv}`;
                }
                handleFieldChange("rut", formatted);
              }}
              autoComplete="off"
            />
          </Grid>

          {/* Dirección */}
          <Grid item>
            <TextField
              label="Dirección"
              variant="outlined"
              size="small"
              fullWidth
              value={formData.address || ""}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              autoComplete="off"
            />
          </Grid>

          {/* Teléfono */}
          <Grid item>
            <TextField
              label="Teléfono"
              variant="outlined"
              size="small"
              fullWidth
              value={formData.phone || ""}
              onChange={(e) => {
                const formatted = e.target.value.replace(/\D/g, "").slice(0, 9);
                handleFieldChange("phone", formatted);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+56</InputAdornment>
                ),
              }}
              autoComplete="off"
            />
          </Grid>

          {/* Divider y subtítulo para datos bancarios */}
          <Grid item>
            <Divider />
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              Cuenta bancaria
            </Typography>
          </Grid>

          {/* Banco */}
          <Grid item>
            <Autocomplete
              options={bankOptions.map((b: any) => ({ id: b.name, name: b.name }))}
              getOptionLabel={(option) => option.name}
              noOptionsText="No se encontraron resultados"
              value={
                bankOptions.map((b: any) => ({ id: b.name, name: b.name }))
                  .find((opt) => opt.id === formData.bank) || null
              }
              onChange={(_, newValue) =>
                handleFieldChange("bank", newValue?.id || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Banco"
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Tipo de cuenta */}
          <Grid item>
            <Autocomplete
              options={accountBankTypes.map((a: any) => ({ id: a.type, name: a.type }))}
              getOptionLabel={(option) => option.name}
              noOptionsText="No se encontraron resultados"
              value={
                accountBankTypes.map((a: any) => ({ id: a.type, name: a.type }))
                  .find((opt) => opt.id === formData.accountType) || null
              }
              onChange={(_, newValue) =>
                handleFieldChange("accountType", newValue?.id || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de cuenta"
                  size="small"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Número de cuenta */}
          <Grid item>
            <TextField
              label="Número de cuenta"
              variant="outlined"
              size="small"
              fullWidth
              value={formData.accountNumber || ""}
              onChange={(e) => handleFieldChange("accountNumber", e.target.value)}
              autoComplete="off"
            />
          </Grid>

          {/* Titular */}
          <Grid item>
            <TextField
              label="Titular"
              variant="outlined"
              size="small"
              fullWidth
              value={formData.holderName || ""}
              onChange={(e) => handleFieldChange("holderName", e.target.value)}
              autoComplete="off"
            />
          </Grid>

          {/* Botón de envío */}
          <Grid item textAlign="right">
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
