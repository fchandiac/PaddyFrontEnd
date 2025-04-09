export interface RiceType {
    id: number;
    name: string;
    description?: string;
    price: number;
    enable: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateRiceTypeDto {
    name: string;
    description?: string;
    price: number;
    enable: boolean;
  }
  
  export interface UpdateRiceTypeDto {
    name?: string;
    description?: string;
    price?: number;
    enable?: boolean;
  }
  