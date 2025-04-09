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
} from "@mui/material";

interface BaseFormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "autocomplete" | "number" | "email" | "password" | "switch";
  required?: boolean;
  options?: { id: string; name: string }[]; // para autocomplete
  multiline?: boolean;
  rows?: number;
}

interface BaseFormProps {
  fields: BaseFormField[];
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  title?: string;
  errors?: string[]; // errores del servidor
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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Grid container spacing={2} direction="column">
        {/* Título del formulario */}
        {title && (
          <Grid item>
            <Typography variant="h6">{`Nuevo ${title}`}</Typography>
          </Grid>
        )}

        {/* Mostrar errores del servidor */}
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

        {/* Render de campos */}
        {fields.map((field) => (
          <Grid item key={field.name}>
            {["text", "textarea", "number", "email", "password"].includes(field.type) ? (
              <TextField
                label={field.label}
                variant="outlined"
                size="small"
                required={field.required}
                multiline={field.multiline}
                rows={field.rows}
                fullWidth
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "email"
                    ? "text"
                    : field.type
                }
                value={values[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                inputProps={
                  field.type === "email"
                    ? {
                        pattern: "[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$",
                        title: "Ingresa un correo válido (ej: persona@dominio.com)",
                      }
                    : undefined
                }
              />
            ) : field.type === "autocomplete" ? (
              <Autocomplete
                options={field.options || []}
                getOptionLabel={(option) => option.name}
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
                    onChange={(e) => onChange(field.name, e.target.checked)}
                    color="primary"
                  />
                }
                label={field.label}
              />
            ) : null}
          </Grid>
        ))}

        {/* Botón de guardar */}
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
