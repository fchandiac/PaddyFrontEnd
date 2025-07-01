"use server";

import {
  CreateReceptionPayload,
  UpdateReceptionPayload,
  Reception,
  FindReceptionByIdType
} from "@/types/reception";
import { createRecord } from "./record"; // importa desde donde esté
import { auth } from "../../auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllReceptions(): Promise<Reception[]> {
  const res = await fetch(`${backendUrl}/receptions`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener recepciones");
  return res.json();
}

export async function getReceptionById(id: number): Promise<Reception> {
  const res = await fetch(`${backendUrl}/receptions/${id}`);
  if (!res.ok) throw new Error("Error al obtener la recepción");
  return res.json();
}

export async function getReceptionByIdToLoad(id: number): Promise<FindReceptionByIdType> {
  const res = await fetch(`${backendUrl}/receptions/${id}`);
  if (!res.ok) throw new Error("Error al obtener la recepción");
  return res.json();
}

export async function createReception(data: CreateReceptionPayload): Promise<Reception> {
  try {
    // Validar que la URL del backend esté definida
    if (!backendUrl) {
      throw new Error('URL del backend no configurada. Verifique sus variables de entorno.');
    }
    
    // Realizar la petición al backend
    const res = await fetch(`${backendUrl}/receptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    // Si la respuesta no es exitosa, intentar obtener un mensaje de error detallado
    if (!res.ok) {
      let errorMessage = 'Error al crear recepción';
      
      // Intentar obtener el mensaje de error del cuerpo de la respuesta
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // Si no podemos parsear la respuesta como JSON, usar el status text
        errorMessage = `${errorMessage}: ${res.statusText} (${res.status})`;
      }
      
      throw new Error(errorMessage);
    }
    
    // Parsear y retornar la respuesta exitosa
    return res.json();
  } catch (error) {
    console.error('Error en createReception:', error);
    throw error; // Re-lanzar el error para que pueda ser manejado por el componente
  }
}


export async function updateReception(
  id: number,
  data: UpdateReceptionPayload
): Promise<Reception> {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar recepción");
  return res.json();
}

export async function deleteReception(
  id: number
): Promise<{ message: string }> {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar recepción");
  return res.json();
}

// Extras útiles
export async function getReceptionsByProducer(
  producerId: number
): Promise<Reception[]> {
  const res = await fetch(`${backendUrl}/receptions/producer/${producerId}`);
  if (!res.ok) throw new Error("Error al obtener recepciones por productor");
  return res.json();
}

export async function getPendingReceptionsByProducer(
  producerId: number
): Promise<Reception[]> {
  const res = await fetch(
    `${backendUrl}/receptions/producer/${producerId}/pending`
  );
  if (!res.ok) throw new Error("Error al obtener recepciones pendientes");
  return res.json();
}

export const getReceptionResumen = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/receptions/resumen`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // opcional si usas SSR o SSG
      }
    );

    if (!res.ok) {
      throw new Error("Error al obtener el resumen de recepciones");
    }

    const data = await res.json();
    
    // Transform data to ensure all needed fields are properly formatted
    const transformedData = data.map((item: any) => ({
      ...item,
      // Ensure these fields are properly converted to numbers
      price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
      grossWeight: typeof item.grossWeight === 'string' ? parseFloat(item.grossWeight) : (item.grossWeight || 0),
      netWeight: typeof item.netWeight === 'string' ? parseFloat(item.netWeight) : (item.netWeight || 0),
      totalConDescuentos: typeof item.totalDiscounts === 'number' ? item.totalDiscounts : (
        typeof item.totalDiscounts === 'string' ? parseFloat(item.totalDiscounts) : 0
      ),
      paddyNeto: typeof item.totalPaddy === 'number' ? item.totalPaddy : (
        typeof item.totalPaddy === 'string' ? parseFloat(item.totalPaddy) : (
          typeof item.totalToPay === 'number' ? item.totalToPay : (
            typeof item.totalToPay === 'string' ? parseFloat(item.totalToPay) : 0
          )
        )
      ),
      // Add producer and riceType fields if they're just IDs
      producer: typeof item.producer === 'object' ? item.producer.name : (
        typeof item.producerName === 'string' ? item.producerName : 'Sin productor'
      ),
      riceType: typeof item.riceType === 'object' ? item.riceType.name : (
        typeof item.riceTypeName === 'string' ? item.riceTypeName : 'Sin tipo'
      )
    }));
    
    return transformedData;
  } catch (error) {
    console.error("❌ Error en getReceptionResumen:", error);
    return [];
  }
};
