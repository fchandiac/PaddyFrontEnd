"use client";

import { useEffect, useState } from "react";
import { RiceType } from "@/types/rice-type";
import { Box, Dialog } from "@mui/material";
import AppDataGrid from "@/components/appDataGrid";
import { getAllRiceTypes, deleteRiceType } from "@/app/actions/rice-type";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useAlertContext } from "@/context/AlertContext";
import { CreateRiceTypeForm } from "./ui/CreateRiceTypeForm";
import { UpdateRiceTypeForm } from "./ui/UpdateRiceTypeForm";
import moment from "moment-timezone";

export default function RiceTypePage() {
  const [riceTypes, setRiceTypes] = useState<RiceType[]>([]);
  const [rowData, setRowData] = useState<RiceType | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showAlert } = useAlertContext();

  const fetchRiceTypes = async () => {
    try {
      const res = await getAllRiceTypes();
      setRiceTypes(res);
    } catch (error) {
      showAlert("Error al obtener tipos de arroz", "error");
    }
  };

  useEffect(() => {
    fetchRiceTypes();
  }, []);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <AppDataGrid
          rows={riceTypes}
          columns={[
            { field: "id", headerName: "ID", flex: 1 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "description", headerName: "Descripción", flex: 2 },
            {
              field: "price",
              headerName: "Precio",
              flex: 1,
              type: "number",
              valueFormatter: (params: any) =>
              {
                return Number(params).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })
              }
            },
            {
              field: "enable",
              headerName: "Habilitado",
              flex: 1,
              valueFormatter: (params: any) => (params ? "Sí" : "No"),
            },
            {
              field: "createdAt",
              headerName: "Creado",
              flex: 1,
              valueFormatter: (params: any) => {
                return moment(params).tz("America/Santiago").format("DD-MM-YYYY HH:mm");
                  
              },
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
          title="Tipos de Arroz"
          height="80vh"
          FormComponent={({ afterSubmit }) => (
            <CreateRiceTypeForm
              afterSubmit={() => {
                afterSubmit();
                setRowData(null);
              }}
            />
          )}
          refresh={fetchRiceTypes}
        />
      </Box>

      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Seguro que deseas eliminar el tipo de arroz "${rowData?.name}"?`}
        onClose={() => setOpenDeleteDialog(false)}
        submit={async () => {
          if (rowData) {
            try {
              await deleteRiceType(rowData.id);
              showAlert("Tipo de arroz eliminado correctamente", "success");
              fetchRiceTypes();
            } catch (error) {
              showAlert("Error al eliminar tipo de arroz", "error");
            } finally {
              setOpenDeleteDialog(false);
              setRowData(null);
            }
          }
        }}
      />

      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <UpdateRiceTypeForm
            initialData={rowData!}
            afterSubmit={() => {
              fetchRiceTypes();
              setOpenEditDialog(false);
            }}
          />
        </Box>
      </Dialog>

    </>
  );
}
