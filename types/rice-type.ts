export interface RiceType {
    id: number;
    code: number;
    name: string;
    description?: string;
    price: number;
    enable: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateRiceTypeDto {
    code: number;
    name: string;
    description?: string;
    price: number;
    enable: boolean;
  }
  
  export interface UpdateRiceTypeDto {
    code?: number;
    name?: string;
    description?: string;
    price?: number;
    enable?: boolean;
  }
