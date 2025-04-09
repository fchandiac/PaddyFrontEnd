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
  humedad: number;
  granosVerdes: number;
  impurezas: number;
  granosManchados: number;
  hualcacho: number;
  granosPelados: number;
  granosYesosos: number;
  bonificacion: number;
  secado: number;
  status: ReceptionStatus;
  createdAt: string;
  updatedAt: string;
}
