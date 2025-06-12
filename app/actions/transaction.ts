"use server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateTransactionDto, Transaction } from "@/types/transaction";

// 🟢 Obtener todas las transacciones (con filtros opcionales)
export async function getAllTransactions(
  queryParams?: Record<string, any>
): Promise<Transaction[]> {
  const query = new URLSearchParams(queryParams || {}).toString();
  const res = await fetch(`${backendUrl}/transactions?${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener las transacciones");
  }

  return res.json();
}

// 🟢 Obtener transacciones por productor
export async function getTransactionsByProducer(
  producerId: number
): Promise<Transaction[]> {
  const res = await fetch(`${backendUrl}/transactions/producer/${producerId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener las transacciones del productor");
  }

  return res.json();
}

// 🟢 Obtener transacción por ID
export async function getTransactionById(id: number): Promise<Transaction> {
  const res = await fetch(`${backendUrl}/transactions/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`No se pudo obtener la transacción con ID ${id}`);
  }

  return res.json();
}

// 🟢 Crear transacción
export async function createTransaction(
  data: CreateTransactionDto
): Promise<any> {
  const res = await fetch(`${backendUrl}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
