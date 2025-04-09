export interface Transaction {
  id: number;
  typeCode: number; // Ej: 1 = ANTICIPO, 2 = LIQUIDACION, 3 = OPEN_ACCOUNT, etc.
  debit: number;
  credit: number;
  balance: number;
  previousBalance: number;
  description: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  producer: {
    id: number;
    name: string;
    rut: string;
  };
  lastTransaction?: Transaction | null;
}

export interface CreateTransactionDto {
  typeCode: number;
  debit: number;
  credit: number;
  balance: number;
  previousBalance: number;
  description: string;
  isDraft?: boolean;
  userId: number;
  producerId: number;
  lastTransaction?: number | null;
}

export interface FilterTransactionDto {
  userId?: number;
  producerId?: number;
  typeCode?: number;
  description?: string;
}

export enum TransactionTypeCode {
  INCOME = 1,
  EXPENSE = 2,
  OPEN_ACCOUNT = 3,
  RECEPTION = 4,
  ADVANCE = 5,
  SETTLEMENT = 6,
  CREDIT_NOTE = 7,
  DEBIT_NOTE = 8,
  PRE_SETTLEMENT = 9,
}
