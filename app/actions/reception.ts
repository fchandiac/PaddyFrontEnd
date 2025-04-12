'use server';

import {
  Reception,
  CreateReceptionPayload,
  UpdateReceptionPayload,
} from '@/types/reception';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllReceptions(): Promise<Reception[]> {
  const res = await fetch(`${backendUrl}/receptions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al obtener recepciones');
  return res.json();
}

export async function getReceptionById(id: number): Promise<Reception> {
  const res = await fetch(`${backendUrl}/receptions/${id}`);
  if (!res.ok) throw new Error('Error al obtener la recepción');
  return res.json();
}

export async function createReception(data: CreateReceptionPayload): Promise<Reception> {
  const res = await fetch(`${backendUrl}/receptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear recepción');
  return res.json();
}

export async function updateReception(id: number, data: UpdateReceptionPayload): Promise<Reception> {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar recepción');
  return res.json();
}

export async function deleteReception(id: number): Promise<{ message: string }> {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar recepción');
  return res.json();
}

// Extras útiles
export async function getReceptionsByProducer(producerId: number): Promise<Reception[]> {
  const res = await fetch(`${backendUrl}/receptions/producer/${producerId}`);
  if (!res.ok) throw new Error('Error al obtener recepciones por productor');
  return res.json();
}

export async function getPendingReceptionsByProducer(producerId: number): Promise<Reception[]> {
  const res = await fetch(`${backendUrl}/receptions/producer/${producerId}/pending`);
  if (!res.ok) throw new Error('Error al obtener recepciones pendientes');
  return res.json();
}


export const getReceptionResumen = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/receptions/resumen`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // opcional si usas SSR o SSG
    });

    if (!res.ok) {
      throw new Error('Error al obtener el resumen de recepciones');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('❌ Error en getReceptionResumen:', error);
    return [];
  }
};
