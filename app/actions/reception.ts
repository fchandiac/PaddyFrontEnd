import { Reception } from '@/types/reception';
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

export async function createReception(data: Partial<Reception>) {
  const res = await fetch(`${backendUrl}/receptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear recepción');
  return res.json();
}

export async function updateReception(id: number, data: Partial<Reception>) {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar recepción');
  return res.json();
}

export async function deleteReception(id: number) {
  const res = await fetch(`${backendUrl}/receptions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar recepción');
  return res.json();
}
