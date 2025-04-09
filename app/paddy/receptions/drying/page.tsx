"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Dialog,
} from "@mui/material";
import AppDataGrid from "@/components/appDataGrid";
import {
  getDiscountPercentsByCode,
  deleteDiscountPercent,
} from "@/app/actions/discount-percent";
import { DiscountPercent } from "@/types/discount-percent";
import { CreateDiscountPercentForm } from "../discounts/ui/CreateDiscountPercentForm";
import { UpdateDiscountPercentForm } from "../discounts/ui/UpdateDiscountPercentForm";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { useAlertContext } from "@/context/AlertContext";

const DISCOUNT_CODE = 8;
const TITLE = "Rangos de bonificación por secado";

export default function DryingDiscountPage() {
  const [rows, setRows] = useState<DiscountPercent[]>([]);
  const [rowData, setRowData] = useState<DiscountPercent | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchData = async () => {
    const result = await getDiscountPercentsByCode(DISCOUNT_CODE);
    setRows(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppDataGrid
            rows={rows}
            columns={[
              { field: "id", headerName: "ID", flex: 0.5 },
              { field: "start", headerName: "Inicio", flex: 1 },
              { field: "end", headerName: "Fin", flex: 1 },
              {
                field: "percent",
                headerName: "% Secado",
                flex: 1,
              },
              {
                field: "actions",
                type: "actions",
                headerName: "",
                flex: 1,
                getActions: (params: any) => [
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
            title={TITLE}
            height="70vh"
            FormComponent={({ afterSubmit }) => (
              <CreateDiscountPercentForm
                defaultCode={DISCOUNT_CODE}
                afterSubmit={() => {
                  afterSubmit();
                  fetchData();
                }}
              />
            )}
            refresh={fetchData}
          />
        </Grid>
      </Grid>

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
            fetchData();
          }
        }}
      />

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
                fetchData();
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
