"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Autocomplete,
  Box,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  getAllDiscountTemplates,
  setDefaultTemplate,
  getDefaultTemplate,
  deleteDiscountTemplate,
  getDiscountTemplatesByProducer,
} from "@/app/actions/discount-template";
import { getAllProducers } from "@/app/actions/producer";
import ArticleIcon from "@mui/icons-material/Article";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import SelectedTemplateTable from "./SelectedTemplateTable";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { TemplateType } from "@/types/discount-template";

interface SelectTemplateProps {
  closeDialog: () => void;
}

interface TemplateToDelete {
  id: number;
  name: string;
}

export default function SelectTemplate({ closeDialog }: SelectTemplateProps) {
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [producers, setProducers] = useState<any[]>([]);
  const [selectedProducer, setSelectedProducer] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<TemplateToDelete>({
    id: 0,
    name: "",
  });
  const [filters, setFilters] = useState({
    groupTolerance: true,
    bonificacion: true,
    secado: true,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType | null>(null);

  useEffect(() => {
    fetchProducers();
    fetchTemplates();
    fetchDefault();
  }, []);

  const fetchProducers = async () => {
    const result = await getAllProducers();
    setProducers(result || []);
  };

  const fetchTemplates = async () => {
    setLoading(true);
    const result = await getAllDiscountTemplates();
    setTemplates(result);
    setLoading(false);
  };

  const fetchDefault = async () => {
    const result = await getDefaultTemplate();
    setSelectedTemplate(result);
  };

  const fetchTemplatesByProducer = async (producerId: number) => {
    setLoading(true);
    const result = await getDiscountTemplatesByProducer(producerId);
    setTemplates(result);
    setLoading(false);
  };

  const handleProducerChange = (_: any, newValue: any | null) => {
    setSelectedProducer(newValue);
    if (newValue?.id) {
      fetchTemplatesByProducer(newValue.id);
    } else {
      fetchTemplates();
    }
  };

  const handleSetDefault = async (id: number) => {
    console.log("🔥 Setting template as default, id:", id);
    setLoading(true);
    const result = await setDefaultTemplate(id);
    console.log("🔥 setDefaultTemplate result:", result);

    if ("error" in result) {
      console.error("🔥 Error setting default template:", result.error);
    } else {
      console.log("🔥 Successfully set default template");
      // Actualizar la plantilla seleccionada también
      await fetchDefault();
    }

    await fetchTemplates();
    console.log("🔥 Templates refreshed after setting default");
    setLoading(false);
  };

  const handleDelete = async () => {
    if (templateToDelete.id) {
      setLoading(true);
      await deleteDiscountTemplate(templateToDelete.id);
      await fetchTemplates();
      setTemplateToDelete({ id: 0, name: "" });
      setOpenDeleteDialog(false);
    }
  };

  const filteredTemplates = templates
    .filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (t) => !filters.groupTolerance || t.useToleranceGroup
    )
    .filter(
      (t) => !filters.bonificacion || t.availableBonus
    )
    .filter((t) => !filters.secado || t.availableDry)
    .sort((a, b) => (a.default ? -1 : b.default ? 1 : 0));

  return (
    <>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12}>
          <Typography variant="h6">
            Plantillas Análisis de Granos
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Buscar plantilla"
            fullWidth
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre de la plantilla"
          />
          <Autocomplete
            sx={{ mt: 2 }}
            size="small"
            options={producers}
            getOptionLabel={(option) =>
              `${option.rut} - ${option.name}`
            }
            value={selectedProducer}
            onChange={handleProducerChange}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Productor"
                fullWidth
              />
            )}
          />

          <FormGroup>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControlLabel
                control={<Checkbox checked={filters.groupTolerance} onChange={(e) => setFilters(f => ({ ...f, groupTolerance: e.target.checked }))} />}
                label="Grupo de tolerancia"
              />
              <FormControlLabel
                control={<Checkbox checked={filters.bonificacion} onChange={(e) => setFilters(f => ({ ...f, bonificacion: e.target.checked }))} />}
                label="Bonificación"
              />
              <FormControlLabel
                control={<Checkbox checked={filters.secado} onChange={(e) => setFilters(f => ({ ...f, secado: e.target.checked }))} />}
                label="Secado"
              />
            </Stack>
          </FormGroup>

          <Box
            mt={2}
            sx={{
              height: 382,
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={20}
                minHeight={100}
              >
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Productor</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTemplates.map((tpl) => (
                    <TableRow
                      key={tpl.id}
                      sx={{
                        backgroundColor:
                          selectedTemplate?.id === tpl.id
                            ? "#e3f2fd"
                            : undefined,
                        display: "table-row",
                      }}
                    >
                      <TableCell sx={{ fontSize: 12 }}>
                        {tpl.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {tpl.producer?.name || "Sin productor"}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                          {!tpl.default && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                setTemplateToDelete({ id: tpl.id, name: tpl.name });
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                          <Tooltip title="Cargar plantilla">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedTemplate(tpl);
                              }}
                            >
                              <ArticleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton
                            size="small"
                            onClick={() => handleSetDefault(tpl.id)}
                          >
                            {tpl.default ? (
                              <StarIcon fontSize="small" color="warning" />
                            ) : (
                              <StarBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8} alignSelf="flex-start">
          {selectedTemplate && (
            <Box
              sx={{
                bgcolor: "#f7f7f7",
                p: 2,
                borderRadius: 2,
                border: "1px solid #ccc",
              }}
            >
              <SelectedTemplateTable
                closeDialog={closeDialog}
                selectedTemplate={selectedTemplate}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Está seguro que desea eliminar la plantilla ${templateToDelete.name}?`}
        onClose={() => setOpenDeleteDialog(false)}
        submit={handleDelete}
      />
    </>
  );
}
