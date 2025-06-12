"use client";

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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";

interface BaseFormField {
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
  autoFocus?: boolean;
  options?: { id: string; name: string }[];
  multiline?: boolean;
  rows?: number;
  inputRef?: React.RefObject<HTMLInputElement>;
  formatFn?: (input: string) => string;
  startAdornment?: React.ReactNode; // ✅ nuevo
  endAdornment?: React.ReactNode;   // ✅ nuevo
}

interface BaseFormProps {
  fields: BaseFormField[];
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  title?: string;
  errors?: string[];
}

export const BaseForm: React.FC<BaseFormProps> = ({
  fields,
  values,
  onChange,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  title,
  errors = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Grid container spacing={2} direction="column">
        {title && (
          <Grid item>
            <Typography variant="h6">{`Nuevo ${title}`}</Typography>
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
            {["text", "textarea", "number", "email", "password"].includes(field.type) ? (
              <TextField
                label={field.label}
                variant="outlined"
                size="small"
                autoFocus={field.autoFocus}
                required={field.required}
                multiline={field.multiline}
                rows={field.rows}
                autoComplete="off"
                fullWidth
                inputRef={field.inputRef}
                type={
                  field.type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : field.type === "number"
                    ? "number"
                    : field.type === "email"
                    ? "text"
                    : field.type
                }
                value={values[field.name] || ""}
                onChange={(e) =>
                  onChange(
                    field.name,
                    field.formatFn ? field.formatFn(e.target.value) : e.target.value
                  )
                }
                inputProps={
                  field.type === "email"
                    ? {
                        pattern: "[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$",
                        title: "Ingresa un correo válido (ej: persona@dominio.com)",
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
                  field.options?.find((opt) => opt.id === values[field.name]) || null
                }
                onChange={(_, newValue) =>
                  onChange(field.name, newValue?.id || "")
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
                    onChange={(e) =>
                      onChange(field.name, e.target.checked)
                    }
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
            {submitLabel ?? "Guardar"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
