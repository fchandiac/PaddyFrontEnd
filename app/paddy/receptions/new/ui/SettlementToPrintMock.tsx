"use client";

import {
  Box,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const anticipos = [
  { banco: "Banco Estado", numero: "225566", fecha: "2024-03-05", monto: 8500000 },
  { banco: "Banco de Chile", numero: "336699", fecha: "2024-04-01", monto: 7200000 },
  { banco: "Banco BICE", numero: "445588", fecha: "2024-04-15", monto: 10000000 },
  { banco: "Banco Security", numero: "558877", fecha: "2024-05-10", monto: 20000000 },
  { banco: "Banco Falabella", numero: "998877", fecha: "2024-10-12", monto: 5300000 },
];

function calcularInteresSimple(monto: number, dias: number, tasaDiaria = 0.0005) {
  return Math.round(monto * tasaDiaria * dias);
}

function diasEntreFechas(fechaInicio: string, fechaFin: string): number {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diff = fin.getTime() - inicio.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function SettlementToPrintMock() {
  const rows = [
    { guia: "7001", fecha: "02-04-2024", guiaDesp: "601", paddyNeto: 30500, precio: 480, valorNeto: 14640000 },
    { guia: "7002", fecha: "08-04-2024", guiaDesp: "602", paddyNeto: 31200, precio: 480, valorNeto: 14976000 },
    { guia: "7003", fecha: "12-04-2024", guiaDesp: "603", paddyNeto: 28900, precio: 480, valorNeto: 13872000 },
    { guia: "7004", fecha: "15-04-2024", guiaDesp: "604", paddyNeto: 33000, precio: 480, valorNeto: 15840000 },
    { guia: "7005", fecha: "18-04-2024", guiaDesp: "605", paddyNeto: 27000, precio: 480, valorNeto: 12960000 },
  ];

  const totalPaddy = rows.reduce((sum, r) => sum + r.paddyNeto, 0);
  const totalValorNeto = rows.reduce((sum, r) => sum + r.valorNeto, 0);
  const iva = Math.round(totalValorNeto * 0.19);
  const total = totalValorNeto + iva;
  const fechaLiquidacion = "2024-11-04";

  const anticiposConInteres = anticipos.map((a) => {
    const dias = diasEntreFechas(a.fecha, fechaLiquidacion);
    const interes = calcularInteresSimple(a.monto, dias);
    return { ...a, dias, interes };
  });

  const totalAnticipos = anticiposConInteres.reduce((sum, a) => sum + a.monto, 0);
  const totalInteres = anticiposConInteres.reduce((sum, a) => sum + a.interes, 0);

  return (
    <Box p={4} sx={{ fontFamily: "Arial", maxWidth: 1000, margin: "auto" }}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography fontWeight="bold">COOPERATIVA AGRÍCOLA DEL SUR</Typography>
          <Typography>Ruta L-30 KM 12</Typography>
          <Typography>Linares</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight="bold">
            LIQUIDACIÓN A PROVEEDORES
          </Typography>
          <Typography>Folio: 2140</Typography>
          <Typography>Fecha: 14/04/2025</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, borderBottomWidth: 2, opacity: 0.6 }} />

      <Box>
        <Typography><strong>RUT:</strong> 15.789.654-2</Typography>
        <Typography><strong>Nombre:</strong> María Eugenia Rivas Torres</Typography>
        <Typography><strong>Giro:</strong> Producción de arroz</Typography>
      </Box>

      <Divider sx={{ my: 2, borderBottomWidth: 2, opacity: 0.6 }} />

      <Typography variant="h6">Detalle de Recepciones</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Guía Recepción</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Guía Despacho</TableCell>
            <TableCell align="right">Paddy Neto</TableCell>
            <TableCell align="right">Precio</TableCell>
            <TableCell align="right">Valor Neto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.guia}</TableCell>
              <TableCell>{row.fecha}</TableCell>
              <TableCell>{row.guiaDesp}</TableCell>
              <TableCell align="right">{row.paddyNeto.toLocaleString("es-CL")}</TableCell>
              <TableCell align="right">{row.precio.toLocaleString("es-CL")}</TableCell>
              <TableCell align="right">{row.valorNeto.toLocaleString("es-CL")}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}><strong>Totales</strong></TableCell>
            <TableCell align="right"><strong>{totalPaddy.toLocaleString("es-CL")}</strong></TableCell>
            <TableCell></TableCell>
            <TableCell align="right"><strong>{totalValorNeto.toLocaleString("es-CL")}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box textAlign="right" mt={3}>
        <Typography><strong>Sub-Total:</strong> {totalValorNeto.toLocaleString("es-CL")}</Typography>
        <Typography><strong>IVA (19%):</strong> {iva.toLocaleString("es-CL")}</Typography>
        <Typography><strong>Total:</strong> {total.toLocaleString("es-CL")}</Typography>
      </Box>

      <Divider sx={{ my: 4, borderBottomWidth: 2, opacity: 0.6 }} />

      <Typography variant="h6">Detalle de Anticipos / Cheques</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Banco</TableCell>
            <TableCell>N°</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell align="right">Días</TableCell>
            <TableCell align="right">Interés</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {anticiposConInteres.map((a, i) => (
            <TableRow key={i}>
              <TableCell>{a.banco}</TableCell>
              <TableCell>{a.numero}</TableCell>
              <TableCell>{a.fecha}</TableCell>
              <TableCell align="right">{a.monto.toLocaleString("es-CL")}</TableCell>
              <TableCell align="right">{a.dias}</TableCell>
              <TableCell align="right">{a.interes.toLocaleString("es-CL")}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}><strong>Totales</strong></TableCell>
            <TableCell align="right"><strong>{totalAnticipos.toLocaleString("es-CL")}</strong></TableCell>
            <TableCell></TableCell>
            <TableCell align="right"><strong>{totalInteres.toLocaleString("es-CL")}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}