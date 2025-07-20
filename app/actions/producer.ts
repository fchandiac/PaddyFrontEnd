"use server";

import { auth } from "../../auth";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { CreateProducerDto, UpdateProducerDto } from "@/types/producer";

// Helper function para obtener headers autenticados
async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await auth();
  
  console.log('🔐 DEBUG - Sesión completa:', session);
  console.log('🔐 DEBUG - Usuario en sesión:', session?.user);
  console.log('🔐 DEBUG - AccessToken:', session?.user?.accessToken);
  
  // Crear headers básicos
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Agregar token JWT si está disponible
  if (session?.user?.accessToken) {
    headers['Authorization'] = `Bearer ${session.user.accessToken}`;
    console.log('✅ Token JWT agregado a headers');
  } else {
    console.error('❌ No se encontró token JWT en la sesión');
    console.log('Datos disponibles en session.user:', Object.keys(session?.user || {}));
  }
  
  // Agregar headers personalizados si hay sesión
  if (session?.user) {
    headers['X-User-Email'] = session.user.email || '';
    headers['X-User-ID'] = String(session.user.id || '');
  }

  // Marcar como consulta automática de UI para no generar auditoría
  headers['X-Request-Source'] = 'UI_AUTO';
  
  console.log('📤 Headers finales:', headers);
  
  return headers;
}

// 🟢 Obtener todos los productores
export async function getAllProducers(): Promise<any[]> {
  try {
    console.log('Intentando obtener productores desde:', `${backendUrl}/producers`);
    
    const headers = await getAuthHeaders();
    console.log('Headers enviados:', headers);
    
    const res = await fetch(`${backendUrl}/producers`, {
      cache: "no-store",
      headers,
    });

    console.log('Respuesta del backend:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries())
    });

    if (!res.ok) {
      let errorText;
      try {
        errorText = await res.text();
        console.error('Error del backend (texto):', errorText);
      } catch (e) {
        console.error('No se pudo leer el texto del error:', e);
        errorText = `No se pudo leer el error. Status: ${res.status}`;
      }
      
      // Intentar parsear como JSON para más detalles
      try {
        const errorData = JSON.parse(errorText);
        console.error('Error del backend (JSON):', errorData);
        throw new Error(`Error al obtener productores: ${res.status} - ${errorData.message || errorText}`);
      } catch (e) {
        // Si no es JSON válido, usar el texto tal como está
        throw new Error(`Error al obtener productores: ${res.status} - ${errorText}`);
      }
    }

    const data = await res.json();
    console.log('Productores obtenidos:', data.length, 'registros');
    return data;
  } catch (error) {
    console.error('Error completo en getAllProducers:', error);
    // Re-lanzar el error pero con un mensaje más amigable si es necesario
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Error inesperado al obtener productores: ${String(error)}`);
    }
  }
}

// 🟢 Crear productor
export async function createProducer(data: CreateProducerDto): Promise<any> {
  const headers = await getAuthHeaders();
  
  const res = await fetch(`${backendUrl}/producers`, {
    method: "POST",
    headers,
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
