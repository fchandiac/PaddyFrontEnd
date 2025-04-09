"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  Dialog,
} from "@mui/material";
import AppDataGrid from "@/components/appDataGrid";
import { getDiscountPercentsByCode, deleteDiscountPercent } from "@/app/actions/discount-percent";
import { DiscountPercent } from "@/types/discount-percent";
import { CreateDiscountPercentForm } from "./ui/CreateDiscountPercentForm";
import { UpdateDiscountPercentForm } from "./ui/UpdateDiscountPercentForm";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { useAlertContext } from "@/context/AlertContext";

const defectOptions = [
  { id: 1, name: "Humedad" },
  { id: 2, name: "Granos verdes" },
  { id: 3, name: "Impurezas" },
  { id: 4, name: "Granos manchados y dañados" },
  { id: 5, name: "Hualcacho" },
  { id: 6, name: "Granos pelados y partidos" },
  { id: 7, name: "Granos yesosos y yesados" },
];

export default function DefectsPage() {
  const [selectedDefect, setSelectedDefect] = useState<typeof defectOptions[0] | null>(null);
  const [rows, setRows] = useState<DiscountPercent[]>([]);
  const [rowData, setRowData] = useState<DiscountPercent | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchData = async (code: number) => {
    const result = await getDiscountPercentsByCode(code);
    setRows(result);
  };

  useEffect(() => {
    if (selectedDefect) {
      fetchData(selectedDefect.id);
    }
  }, [selectedDefect]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Autocomplete */}
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={defectOptions}
            getOptionLabel={(option) => option.name}
            value={selectedDefect}
            onChange={(_, newValue) => setSelectedDefect(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Tipo de defecto" size="small" />
            )}
          />
        </Grid>

        {/* DataGrid */}
        <Grid item xs={12} sm={9}>
          <AppDataGrid
            rows={rows}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "start", headerName: "Inicio", flex: 1 },
              { field: "end", headerName: "Fin", flex: 1 },
              {
                field: "percent",
                headerName: "Descuento (%)",
                flex: 1,
              },
              {
                field: "actions",
                type: "actions",
                headerName: "",
                flex: 1,
                getActions: (params:any) => [
                  <GridActionsCellItem
                    icon={<Edit />}
                    label="Editar"
                    onClick={() => {
                      setRowData(params.row);
                      setOpenEditDialog(true);
                    }}
                  />,
                  <GridActionsCellItem
                    icon={<Delete />}
                    label="Eliminar"
                    onClick={() => {
                      setRowData(params.row);
                      setOpenDeleteDialog(true);
                    }}
                  />,
                ],
              },
            ]}
            title={`Rangos de descuento ${selectedDefect?.name || ""}`}
            height="70vh"
            FormComponent={({ afterSubmit }) =>
              selectedDefect ? (
                <CreateDiscountPercentForm
                  defaultCode={selectedDefect.id}
                  afterSubmit={() => {
                    afterSubmit();
                    fetchData(selectedDefect.id);
                  }}
                />
              ) : (
                <></>
              )
            }
            refresh={() => {
              if (selectedDefect) fetchData(selectedDefect.id);
            }}
          />
        </Grid>
      </Grid>

      {/* Diálogo de eliminación */}
      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Estás seguro de que deseas eliminar el rango con ID ${rowData?.id}?`}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        submit={async () => {
          if (rowData) {
            await deleteDiscountPercent(rowData.id);
            showAlert("Rango eliminado correctamente", "success");
            setOpenDeleteDialog(false);
            if (selectedDefect) fetchData(selectedDefect.id);
          }
        }}
      />

      {/* Diálogo de edición */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setRowData(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          {rowData && (
            <UpdateDiscountPercentForm
              initialData={rowData}
              afterSubmit={() => {
                setOpenEditDialog(false);
                setRowData(null);
                if (selectedDefect) fetchData(selectedDefect.id);
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
