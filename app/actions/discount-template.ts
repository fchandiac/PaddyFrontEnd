'use server';

import { TemplateType, CreateTemplateType } from '@/types/discount-template';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';




// Crear plantilla
export async function createDiscountTemplate(
  data: CreateTemplateType
): Promise<TemplateType | { error: string }> {
  try {
    const res = await fetch(`${backendUrl}/template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al crear la plantilla');
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message || 'Error inesperado al crear plantilla' };
  }
}

// Eliminar plantilla
export async function deleteDiscountTemplate(
  id: number
): Promise<{ success: boolean } | { error: string }> {
  try {
    const res = await fetch(`${backendUrl}/template/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Error al eliminar la plantilla');

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Error inesperado al eliminar' };
  }
}

// Listar todas las plantillas
export async function getAllDiscountTemplates(): Promise<TemplateType[]> {
  const res = await fetch(`${backendUrl}/template`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Error al obtener las plantillas');
  }

  return await res.json();
}

// Listar plantillas por productor
export async function getDiscountTemplatesByProducer(
  producerId: number
): Promise<TemplateType[]> {
  const res = await fetch(
    `${backendUrl}/template/by-producer/${producerId}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Error al obtener las plantillas del productor');
  }

  return await res.json();
}


export async function setDefaultTemplate(id: number): Promise<TemplateType | { error: string }> {
  try {
    console.log('🔥 Backend: Setting template as default, id:', id);
    const res = await fetch(`${backendUrl}/template/set-default/${id}`, {
      method: 'PATCH',
    });

    console.log('🔥 Backend: Response status:', res.status, res.statusText);

    if (!res.ok) {
      const err = await res.json();
      console.error('🔥 Backend: Error response:', err);
      throw new Error(err.message || 'Error al marcar como predeterminada');
    }

    const result = await res.json();
    console.log('🔥 Backend: Success response:', result);
    return result;
  } catch (error: any) {
    console.error('🔥 Backend: Exception in setDefaultTemplate:', error);
    return { error: error.message || 'Error inesperado al marcar como predeterminada' };
  }
}


export async function getDefaultTemplate(): Promise<TemplateType | null> {
  try {
    const res = await fetch(`${backendUrl}/template/default`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'No se pudo obtener la plantilla predeterminada');
    }

    return await res.json();
  } catch (error: any) {
    console.error("Error al obtener plantilla predeterminada:", error);
    return null;
  }
}


export async function getDiscountTemplateById(id: number): Promise<TemplateType | null> {
  try {
    const res = await fetch(`${backendUrl}/template/find-by-id/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error al obtener la plantilla');
    }

    return await res.json();
  } catch (error) {
    console.error("Error al obtener plantilla por ID:", error);
    return null;
  }
}

// Actualizar plantilla
export async function updateDiscountTemplate(
  id: number,
  data: Partial<CreateTemplateType>
): Promise<TemplateType | { error: string }> {
  try {
    const res = await fetch(`${backendUrl}/template/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al actualizar la plantilla');
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message || 'Error inesperado al actualizar plantilla' };
  }
}



