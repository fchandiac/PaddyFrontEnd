"use client";

import { Box, Grid, Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllProducers } from "@/app/actions/producer";
import { getTransactionsByProducer } from "@/app/actions/transaction";
import AppDataGrid from "@/components/appDataGrid";
import { Producer } from "@/types/producer";
import moment from "moment";
import { Transaction } from "@/types/transaction";



const TransactionTypeCode = [
  { code: 1, name: "Ingreso" },
  { code: 2, name: "Gasto" },
  { code: 3, name: "Apertura de cuenta" },
  { code: 4, name: "Recepción" },
  { code: 5, name: "Anticipo" },
  { code: 6, name: "Liquidación" },
  { code: 7, name: "Nota de crédito" },
  { code: 8, name: "Nota de débito" },
  { code: 9, name: "Pre-liquidación" },
];


export default function Page() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const res = await getAllProducers();
        setProducers(res);
      } catch (err) {
        console.error("Error al cargar productores", err);
      }
    };
    fetchProducers();
  }, []);

  useEffect(() => {
    if (selectedProducer) {
      const fetchTransactions = async () => {
        try {
          const trx = await getTransactionsByProducer(selectedProducer.id);
          setTransactions(trx);
        } catch (err) {
          console.error("Error al cargar transacciones del productor", err);
        }
      };
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [selectedProducer]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Autocomplete
            options={producers}
            getOptionLabel={(option) => `${option.name} (${option.rut})`}
            onChange={(_, value) => setSelectedProducer(value)}
            renderInput={(params) => (
              <TextField {...params} label="Buscar productor" variant="outlined" size="small" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={9}>
          <AppDataGrid
            rows={transactions}
            columns={[
              { field: "id", headerName: "ID", flex: 1 },
              { field: "typeCode", headerName: "Tipo", flex: 1,
                valueFormatter: (params: any) => {
                  const type = TransactionTypeCode.find(
                    (type:any) => type.code === params
                  );
                  return type ? type.name : "";
                },
               },
               { field: "description", headerName: "Descripción", flex: 2 },
              { field: "debit", headerName: "Débito", flex: 1,
                valueFormatter: (params: any) => {
                  return params.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                },
               },
              { field: "credit", headerName: "Crédito", flex: 1,
                valueFormatter: (params: any) => {
                  return params.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                },
               },
              { field: "balance", headerName: "Balance", flex: 1,
                valueFormatter: (params: any) => {
                  return params.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });
                },
               },
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
            title={`Transacciones ${selectedProducer ? `de ${selectedProducer.name}` : ""}`}
            height="75vh"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
