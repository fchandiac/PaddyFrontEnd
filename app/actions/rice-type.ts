"use server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateRiceTypeDto, UpdateRiceTypeDto } from "@/types/rice-type";

// 🟢 Obtener todos los tipos de arroz
export async function getAllRiceTypes(): Promise<any[]> {
  const res = await fetch(`${backendUrl}/rice-types`);
  if (!res.ok) throw new Error("Error al obtener tipos de arroz");
  return res.json();
}

// 🟢 Crear tipo de arroz
export async function createRiceType(data: CreateRiceTypeDto): Promise<any> {
  const res = await fetch(`${backendUrl}/rice-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) return { error: true, message: result.message };
  return result;
}

// 🟢 Actualizar tipo de arroz
export async function updateRiceType(id: number, data: UpdateRiceTypeDto): Promise<any> {
  const res = await fetch(`${backendUrl}/rice-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) return { error: true, message: result.message };
  return result;
}

// 🟢 Eliminar tipo de arroz
export async function deleteRiceType(id: number): Promise<void> {
  const res = await fetch(`${backendUrl}/rice-types/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al eliminar tipo de arroz");
  }
}
