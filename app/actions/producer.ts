"use server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateProducerDto, UpdateProducerDto } from "@/types/producer";

// 🟢 Obtener todos los productores
export async function getAllProducers(): Promise<any[]> {
  const res = await fetch(`${backendUrl}/producers`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener productores");
  }

  return res.json();
}

// 🟢 Crear productor
export async function createProducer(data: CreateProducerDto): Promise<any> {
  const res = await fetch(`${backendUrl}/producers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return await res.json(); // backend podría devolver { error, message }
  }

  return await res.json();
}

// 🟢 Actualizar productor
export async function updateProducer(
  id: number,
  data: UpdateProducerDto
): Promise<any> {
  const res = await fetch(`${backendUrl}/producers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return await res.json();
  }

  return await res.json();
}

// 🟢 Eliminar productor
export async function deleteProducer(id: number): Promise<void> {
  const res = await fetch(`${backendUrl}/producers/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar productor");
  }
}



// 🟢 Crear productor con cuenta bancaria
export async function createProducerWithBankAccount(data: any): Promise<any> {
  const res = await fetch(`${backendUrl}/producers/with-bank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return await res.json(); // backend podría devolver { error, message }
  }

  return await res.json();
}

// 🟢 Agregar cuenta bancaria a un productor existente
export async function addBankAccountToProducer(
  producerId: number,
  account: {
    bank: string;
    accountNumber: string;
    accountType: string;
    holderName: string;
  }
): Promise<any> {
  const res = await fetch(`${backendUrl}/producers/${producerId}/add-bank-account`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });

  if (!res.ok) {
    return await res.json();
  }

  return await res.json();
}
