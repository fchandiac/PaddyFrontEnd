"use client";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Grid,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Stack,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";

interface BaseUpdateFormField {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "autocomplete"
    | "number"
    | "email"
    | "password"
    | "switch";
  required?: boolean;
  options?: { id: string; name: string }[]; // para autocomplete
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  formatFn?: (input: string) => string; // ✅ nueva propiedad para formateo en tiempo real
  startAdornment?: React.ReactNode; // ✅ nuevo
  endAdornment?: React.ReactNode; // ✅ nuevo
  inputRef?: React.RefObject<HTMLInputElement>;
}

interface BaseUpdateFormProps {
  fields: BaseUpdateFormField[];
  initialState: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  isSubmitting?: boolean;
  errors?: string[];
  title?: string;
}

export const BaseUpdateForm: React.FC<BaseUpdateFormProps> = ({
  fields,
  initialState,
  onSubmit,
  isSubmitting = false,
  errors = [],
  title = "Elemento",
}) => {
  const [values, setValues] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setValues(initialState);
  }, [initialState]);

  const handleChange = (field: string, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} direction="column">
        {title && (
          <Grid item>
            <Typography variant="h6">Editar {title}</Typography>
          </Grid>
        )}

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

        {fields.map((field) => (
          <Grid item key={field.name}>
            {["text", "textarea", "number", "email", "password"].includes(
              field.type
            ) ? (
              <TextField
                label={field.label}
                variant="outlined"
                size="small"
                required={field.required}
                multiline={field.multiline}
                autoComplete="off"
                rows={field.rows}
                inputRef={field.inputRef}
                fullWidth
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "email"
                    ? "text"
                    : field.type
                }
                disabled={field.disabled}
                value={values[field.name] ?? ""}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    field.formatFn
                      ? field.formatFn(e.target.value)
                      : e.target.value
                  )
                }
                inputProps={
                  field.type === "email"
                    ? {
                        pattern: "[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$",
                        title:
                          "Ingresa un correo válido (ej: persona@dominio.com)",
                      }
                    : undefined
                }
                InputProps={{
                  startAdornment: field.startAdornment ? (
                    <InputAdornment position="start">
                      {field.startAdornment}
                    </InputAdornment>
                  ) : undefined,
                  endAdornment:
                    field.type === "password" ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ) : field.endAdornment ? (
                      <InputAdornment position="end">
                        {field.endAdornment}
                      </InputAdornment>
                    ) : undefined,
                }}
              />
            ) : field.type === "autocomplete" ? (
              <Autocomplete
                options={field.options || []}
                getOptionLabel={(option) => option.name}
                noOptionsText="No se encontraron resultados"
                value={
                  field.options?.find((opt) => opt.id === values[field.name]) ||
                  null
                }
                onChange={(_, newValue) =>
                  handleChange(field.name, newValue?.id || "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.label}
                    size="small"
                    variant="outlined"
                    fullWidth
                    required={field.required}
                  />
                )}
              />
            ) : field.type === "switch" ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(values[field.name])}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    color="primary"
                  />
                }
                label={field.label}
              />
            ) : null}
          </Grid>
        ))}

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
            Actualizar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
