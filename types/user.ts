export interface User {
    id: number;
    name: string;
    email: string;
    role: 'administrador' | 'contador' | 'operador';
    createdAt?: string;
    status?: 'activo' | 'inactivo';
  }
  