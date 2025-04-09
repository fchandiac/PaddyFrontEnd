"use server";
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateRecordDto } from "@/types/record"; // O define la interfaz aquí si no la tienes

export async function getAllRecords() {
  try {
    const res = await fetch(`${backendUrl}/records`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // para evitar que Next.js lo cachee
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Error al obtener los registros" };
    }

    return await res.json();
  } catch (error: any) {
    return {
      error: error.message || "Error inesperado al obtener los registros",
    };
  }
}

export async function createRecord(data: CreateRecordDto) {
  try {
    const res = await fetch(`${backendUrl}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      return { error: error.message || "Error al crear el registro" };
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message || "Error inesperado al crear el registro" };
  }
}
