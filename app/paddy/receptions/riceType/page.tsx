"use client";

import { useEffect, useState } from "react";
import { RiceType } from "@/types/rice-type";
import { Box, Dialog, Grid } from "@mui/material";
import AppDataGrid from "@/components/appDataGrid";
import { getAllRiceTypes, deleteRiceType } from "@/app/actions/rice-type";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useAlertContext } from "@/context/AlertContext";
import { useUser } from "@/hooks/useUser";
import { CreateRiceTypeForm } from "./ui/CreateRiceTypeForm";
import { UpdateRiceTypeForm } from "./ui/UpdateRiceTypeForm";
import moment from "moment-timezone";

const TITLE = "Tipos de Arroz";

export default function RiceTypePage() {
  const [riceTypes, setRiceTypes] = useState<RiceType[]>([]);
  const [rowData, setRowData] = useState<RiceType | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { showAlert } = useAlertContext();
  const { user } = useUser();

  const fetchRiceTypes = async () => {
    try {
      const res = await getAllRiceTypes();
      console.log('🌾 DEBUG - Datos de tipos de arroz recibidos:', res);
      
      // Debuggear el primer elemento para ver la estructura
      if (res.length > 0) {
        console.log('🌾 DEBUG - Primer tipo de arroz:', res[0]);
        console.log('🌾 DEBUG - Campos disponibles:', Object.keys(res[0]));
        console.log('🌾 DEBUG - Campo createdAt:', res[0].createdAt);
        console.log('🌾 DEBUG - Tipo de createdAt:', typeof res[0].createdAt);
      }
      
      setRiceTypes(res);
    } catch (error) {
      showAlert("Error al obtener tipos de arroz", "error");
    }
  };

  useEffect(() => {
    fetchRiceTypes();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AppDataGrid
            rows={riceTypes}
            columns={[
              { field: "code", headerName: "Código", flex: 1 },
              { field: "name", headerName: "Nombre", flex: 2 },
              { field: "description", headerName: "Descripción", flex: 2 },
              { 
                field: "price", 
                headerName: "Precio (CLP)", 
                flex: 1,
                valueFormatter: (params: GridRenderCellParams<RiceType>) => 
                  params.value != null ? params.value.toLocaleString('es-CL') : 'Sin precio'
              },
              { 
                field: "enable", 
                headerName: "Estado", 
                flex: 1,
                valueFormatter: (params: GridRenderCellParams<RiceType>) => 
                  params.value != null ? (params.value ? "Habilitado" : "Deshabilitado") : 'Sin estado'
              },
              {
                field: "createdAt",
                headerName: "Fecha de creación",
                flex: 2,
                valueFormatter: (params: any) => {
                  console.log('🗓️ DEBUG - Params completo:', params);
                  console.log('🗓️ DEBUG - Valor fecha (params):', params, 'Tipo:', typeof params);
                  console.log('🗓️ DEBUG - Valor fecha (params.value):', params?.value, 'Tipo:', typeof params?.value);
                  
                  // Probar ambos enfoques como en records
                  const dateValue = params?.value || params;
                  if (!dateValue) return 'Sin fecha';
                  
                  try {
                    const formatted = moment(dateValue).local().format("DD/MM/YYYY HH:mm");
                    console.log('🗓️ DEBUG - Fecha formateada:', formatted);
                    return formatted;
                  } catch (error) {
                    console.error('🗓️ ERROR - Error formateando fecha:', error);
                    return 'Fecha inválida';
                  }
                }
              },
              {
                field: "actions",
                type: "actions",
                headerName: "Acciones",
                flex: 1,
                getActions: (params: GridRenderCellParams<RiceType>) => [
                  <GridActionsCellItem
                    key="edit"
                    icon={<Edit />}
                    label="Editar"
                    onClick={() => {
                      setRowData(params.row);
                      setOpenEditDialog(true);
                    }}
                  />,
                  <GridActionsCellItem
                    key="delete"
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
              <CreateRiceTypeForm
                afterSubmit={() => {
                  afterSubmit();
                  fetchRiceTypes();
                }}
              />
            )}
            refresh={fetchRiceTypes}
          />
        </Grid>
      </Grid>

      {/* Diálogo de edición */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setRowData(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          {rowData && (
            <UpdateRiceTypeForm
              initialData={rowData}
              afterSubmit={() => {
                setOpenEditDialog(false);
                setRowData(null);
                fetchRiceTypes();
              }}
            />
          )}
        </Box>
      </Dialog>

      {/* Diálogo de eliminación */}
      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Está seguro que desea eliminar el tipo de arroz ${rowData?.name}?`}
        onClose={() => {
          setOpenDeleteDialog(false);
          setRowData(null);
        }}
        submit={async () => {
          if (rowData && rowData.id) {
            await deleteRiceType(rowData.id, user?.id);
            showAlert("Tipo de arroz eliminado correctamente", "success");
            setRowData(null);
            fetchRiceTypes();
          }
          setOpenDeleteDialog(false);
        }}
      />
    </Box>
  );
}
