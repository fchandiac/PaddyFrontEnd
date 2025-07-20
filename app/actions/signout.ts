'use server';

import { createAuditLog } from './audit';

// Server action para registrar auditoría de cierre de sesión
export async function logSignOutAudit(userId: number) {
  try {
    console.log('Registrando auditoría de cierre de sesión para usuario:', userId);
    await createAuditLog({
      userId: userId,
      action: 'signOut',
      entityType: 'User',
      description: 'Cierre de sesión',
      success: true,
    });
    console.log('Auditoría de cierre de sesión registrada exitosamente');
    return { success: true };
  } catch (error) {
    console.error('Error registrando auditoría de cierre de sesión:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}
