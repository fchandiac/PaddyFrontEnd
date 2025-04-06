// components/BaseForm.tsx
import {
    Grid,
    TextField,
    Autocomplete,
    Button,
    CircularProgress,
    Typography,
  } from "@mui/material";
  
  interface BaseFormField {
    name: string;
    label: string;
    type: "text" | "textarea" | "autocomplete" | "number" | "email" | "password";
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
    submitLabel?: string; // opcional
    update?: boolean;
    title?: string;
  }
  
  export const BaseForm: React.FC<BaseFormProps> = ({
    fields,
    values,
    onChange,
    onSubmit,
    isSubmitting = false,
    submitLabel,
    update = false,
    title,
  }) => {
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
              <Typography variant="h6">
                {update ? `Editar ${title}` : `Nuevo ${title}`}
              </Typography>
            </Grid>
          )}
  
          {fields.map((field) => (
            <Grid item key={field.name}>
              {field.type === "text" ||
              field.type === "textarea" ||
              field.type === "number" ||
              field.type === "email" ||
              field.type === "password" ? (
                <TextField
                  label={field.label}
                  variant="outlined"
                  size="small"
                  required={field.required}
                  multiline={field.multiline}
                  rows={field.rows}
                  fullWidth
                  type={field.type === "number" ? "number" : field.type}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
              ) : field.type === "autocomplete" ? (
                <Autocomplete
                  options={field.options || []}
                  getOptionLabel={(option) => option.name}
                  value={
                    field.options?.find(
                      (opt) => opt.id === values[field.name]
                    ) || null
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
              ) : null}
            </Grid>
          ))}
  
          <Grid item textAlign="right">
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {submitLabel ?? (update ? "Actualizar" : "Guardar")}
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  };
  