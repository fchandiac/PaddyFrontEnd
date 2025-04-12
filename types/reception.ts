export type ReceptionStatus = 'pending' | 'settled' | 'canceled';

export interface Reception {
  id: number;
  producerId: number;
  riceTypeId: number;
  price: number;
  guide: string;
  licensePlate: string;
  grossWeight: number;
  tare: number;
  netWeight: number;

  // Análisis de granos (percent + tolerance)
  percentHumedad: number;
  toleranceHumedad: number;

  percentGranosVerdes: number;
  toleranceGranosVerdes: number;

  percentImpurezas: number;
  toleranceImpurezas: number;

  percentGranosManchados: number;
  toleranceGranosManchados: number;

  percentHualcacho: number;
  toleranceHualcacho: number;

  percentGranosPelados: number;
  toleranceGranosPelados: number;

  percentGranosYesosos: number;
  toleranceGranosYesosos: number;

  // Bonificación y secado
  toleranceBonificacion: number;
  percentSecado: number;

  // 💰 Total a pagar
  totalToPay: number;

  // Observación
  note: string;

  status: ReceptionStatus;
  createdAt: string;
  updatedAt: string;

  // Relaciones opcionales (si backend las incluye)
  producer?: {
    id: number;
    name: string;
    rut: string;
  };

  riceType?: {
    id: number;
    name: string;
  };
}

// Payload para crear una recepción (POST)
export interface CreateReceptionPayload {
  producerId: number;
  riceTypeId: number;
  price: number;
  guide: string;
  licensePlate: string;
  grossWeight: number;
  tare: number;
  netWeight: number;

  percentHumedad: number;
  toleranceHumedad: number;

  percentGranosVerdes: number;
  toleranceGranosVerdes: number;

  percentImpurezas: number;
  toleranceImpurezas: number;

  percentGranosManchados: number;
  toleranceGranosManchados: number;

  percentHualcacho: number;
  toleranceHualcacho: number;

  percentGranosPelados: number;
  toleranceGranosPelados: number;

  percentGranosYesosos: number;
  toleranceGranosYesosos: number;

  toleranceBonificacion: number;
  percentSecado: number;

  totalToPay: number; // ✅ nuevo campo requerido

  note: string;

  status?: ReceptionStatus;
}

// Payload para actualizar recepción (PATCH)
export type UpdateReceptionPayload = Partial<CreateReceptionPayload>;
