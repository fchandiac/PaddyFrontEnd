export interface Producer {
    id: number;
    name: string;
    businessName: string;
    rut: string;
    address: string;
    phone: string;
    createdAt: string; // o Date si ya lo estás tratando como objeto de fecha
  }
  
  export type CreateProducerDto = Omit<Producer, "id" | "createdAt">;
  
  export type UpdateProducerDto = Partial<CreateProducerDto>;
  