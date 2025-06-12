"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "@/app/actions/user";
import { User } from "@/types/user";
import AppDataGrid from "@/components/appDataGrid";
import { Box, Dialog, DialogContent } from "@mui/material";
import { UserForm } from "./ui/CreateUserForm";
import moment from "moment-timezone";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { useAlertContext } from "@/context/AlertContext";
import { DeleteDialog } from "@/components/deleteDialog/DeleteDialog";
import { UpdateUserForm } from "./ui/UpdateUserForm";
import { createRecord } from "@/app/actions/record";
import { useUserContext } from "@/context/UserContext";


export default function UserPage() {
  const { showAlert } = useAlertContext();
  const [users, setUsers] = useState<User[]>([]);
  const [rowData, setRowData] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false); 
  const { user } = useUserContext();
  const userId = user?.id || null;

  const fetchUsers = async () => {
    try {
      const result = await getAllUsers();
      setUsers(result);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <AppDataGrid
          rows={users}
          columns={[
            { field: "id", headerName: "Id", flex: 1 },
            { field: "name", headerName: "Nombre", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "role", headerName: "Rol", flex: 1 },
            {
              field: "createdAt",
              headerName: "Fecha de creación",
              flex: 1,
               valueFormatter: (params: any) => {
                            return moment(params).tz("America/Santiago")
                            .format("DD-MM-YYYY HH:mm");
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
                    setOpenEditDialog(true); // ✅ Abrimos el dialog de edición
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
          title="Usuarios"
          height="80vh"
          FormComponent={({ afterSubmit }) => (
            <UserForm
              afterSubmit={() => {
                afterSubmit();
                setRowData(null);
              }}
            />
          )}
          refresh={fetchUsers}
        />
      </Box>

      {/* 🗑️ Diálogo de eliminación */}
      <DeleteDialog
        open={openDeleteDialog}
        message={`¿Estás seguro de que deseas eliminar al usuario "${rowData?.name}"?`}
        onClose={() => setOpenDeleteDialog(false)}
        submit={async () => {
          if (rowData) {
            try {
              await deleteUser(rowData.id);
              await createRecord({
                userId: userId,
                entity: "usuarios",
                description: `Eliminó al usuario ${rowData.name} (${rowData.email})`,
              });
              showAlert("Usuario eliminado correctamente", "success");
              fetchUsers();
            } catch (error) {
              showAlert("Error al eliminar el usuario", "error");
            } finally {
              setOpenDeleteDialog(false);
              setRowData(null);
            }
          }
        }}
      />

      {/* 📝 Diálogo de edición */}
      <Dialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setRowData(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 1 }}>
          <UpdateUserForm
            initialData={rowData!}
            afterSubmit={() => {
              fetchUsers();
              setOpenEditDialog(false);
              setRowData(null);
            }}
          />
        </Box>
    
      </Dialog>
    </>
  );
}
