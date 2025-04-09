"use client";
import React, { useState, useEffect } from "react";
import { getAllRecords } from "@/app/actions/record";
import { Box } from "@mui/material";
import AppDataGrid from "@/components/appDataGrid";
import { RecordFlat } from "@/types/record";
import moment from "moment-timezone";

export default function Page() {
  const [records, setRecords] = useState<RecordFlat[]>([]);

  const fetchRecords = async () => {
    try {
      const result = await getAllRecords();
      setRecords(result); // ✅ guardar en el state

      console.log(typeof result[0].createdAt);

      console.log("Registros obtenidos:", result);
    } catch (error) {
      console.error("Error al obtener los registros:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <AppDataGrid
        rows={records}
        columns={[
          { field: "id", headerName: "ID", flex: 1 },
          { field: "userId", headerName: "ID Usuario", flex: 1, hide: true },
          { field: "userName", headerName: "Nombre Usuario", flex: 1 },
          { field: "identity", headerName: "Identidad", flex: 1 },
          { field: "description", headerName: "Descripción", flex: 2 },
          {
            field: "createdAt",
            headerName: "Fecha",
            flex: 1,
            valueFormatter: (params: any) => {
              return moment(params)
              .subtract(4, "hours") // Resta 4 horas manualmente
              .format("DD-MM-YYYY HH:mm");
            },
          },
        ]}
      />
    </Box>
  );
}
