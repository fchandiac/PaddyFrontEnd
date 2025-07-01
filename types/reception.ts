import { TemplateType } from "./discount-template";

export type ReceptionStatus = "pending" | "settled" | "canceled";

export interface Reception {
  toleranceGroupValue: number;
  useToleranceGroup: boolean;
  toleranceVano: number;
  percentVano: number;
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
    address: string;
    businessName: string;
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
  // Eliminado: discountTemplateId?: number;
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

  percentVano: number;
  toleranceVano: number;

  toleranceBonificacion: number;
  percentSecado: number;

  totalToPay: number; // ✅ nuevo campo requerido

  note: string;

  status?: ReceptionStatus;
}

// Payload para actualizar recepción (PATCH)

export type GrainAnalysisParamType =
  | "param"
  | "toleranceGroup"
  | "resume"
  | "bonus"
  | "drying"
  | "";

export interface Range {
  start: number;
  end: number;
  percent: number;
}

export interface GrainAnalysisParam {
  name: string;
  order: number;
  type:
    | "param"
    | "toleranceGroupParam"
    | "toleranceGroupResume"
    | "resume"
    | "bonus"
    | "dry";
  paramCode: number;
  percent: number;
  tolerance: number;
  penalty: number;
  available: boolean;
  showRange: boolean;
  showPercent: boolean;
  showTolerance: boolean;
  showPenalty: boolean;
  penaltyLabel: string;
  groupTolerance: boolean;
  /**
   * List of discount ranges for this parameter (loaded externally)
   */
  ranges: Range[];
  setShowTolerance: (show: boolean) => void;
  setPercent: (val: number) => void;
  setTolerance: (val: number) => void;
  setPenalty: (val: number) => void;
  update?: boolean;
  loading?: boolean;
}

export interface PercentageByRangeProps {
  order: number;
  type: "param" | "toleranceGroup" | "resume" | "bonus" | "drying" | "";
  paramCode?: number | null | undefined;
  name: string;
  percent?: number | null | undefined;
  tolerance?: number | null | undefined;
  penalty?: number | null | undefined;
  available: boolean;
  showRange: boolean;
  showPercent: boolean;
  showTolerance: boolean;
  showPenalty: boolean;
  penaltyLabel?: string;
  groupTolerance: boolean;
  setShowTolerance: (showTolerance: boolean) => void;
  setPercent: (percent: number) => void;
  setTolerance: (tolerance: number) => void;
  setPenalty: (penalty: number) => void;
}

export interface ReceptionFromDB {
  id: number;
  producerId: number;
  riceTypeId: number;
  price: string | number;
  guide: string;
  licensePlate: string;
  grossWeight: string | number;
  tare: string | number;
  netWeight: string | number;
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
  percentVano: number;
  toleranceVano: number;
  toleranceBonificacion: number;
  percentSecado: number;
  note: string;
  status: string;
  totalToPay: number;
  createdAt: string;
  updatedAt: string;
  producer: {
    id: number;
    name: string;
    businessName: string;
    rut: string;
    address: string;
    phone: string;
    bankAccounts?: {
      bank: string;
      holderName: string;
      accountType: string;
      accountNumber: string;
    }[];
  };
  riceType: {
    id: number;
    name: string;
    description: string;
    price: string | number;
    enable: boolean;
  };
}

export interface ReceptionToPrintDto {
  id: number;
  guide: string;
  licensePlate: string;
  grossWeight: number | string;
  tare: number | string;
  netWeight: number | string;
  createdAt: string;

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
  percentVano: number;
  toleranceVano: number;

  toleranceBonificacion: number;
  percentSecado: number;

  note: string;

  producer: {
    name: string;
    rut: string;
    address: string;
    businessName: string;
  };

  riceType: {
    name: string;
  };
}

export interface FindReceptionByIdType {
  id: number;
  producerId: number;
  riceTypeId: number;
  price: string;
  guide: string;
  licensePlate: string;
  grossWeight: string;
  tare: string;
  netWeight: string;
  groupToleranceValue: number;

  useToleranceGroup: boolean;
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
  percentVano: number;
  toleranceVano: number;
  toleranceBonificacion: number;
  percentSecado: number;
  note: string;
  status: "pending" | "settled" | "canceled";
  discountTemplateId: number;
  totalToPay: number;
  createdAt: string;
  updatedAt: string;
  producer: {
    id: number;
    name: string;
    businessName: string;
    rut: string;
    address: string;
    phone: string;
    bankAccounts: {
      bank: string;
      holderName: string;
      accountType: string;
      accountNumber: string;
    }[];
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  riceType: {
    id: number;
    name: string;
    description: string;
    price: string;
    enable: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  discountTemplate: {
    id: number;
    name: string;
    useToleranceGroup: boolean;
    groupToleranceValue: number;

    producerId: number | null;
    availableHumedad: boolean;
    percentHumedad: number;
    toleranceHumedad: number;
    showToleranceHumedad: boolean;
    groupToleranceHumedad: boolean;

    availableGranosVerdes: boolean;
    percentGranosVerdes: number;
    toleranceGranosVerdes: number;
    showToleranceGranosVerdes: boolean;
    groupToleranceGranosVerdes: boolean;

    availableImpurezas: boolean;
    percentImpurezas: number;
    toleranceImpurezas: number;
    showToleranceImpurezas: boolean;
    groupToleranceImpurezas: boolean;

    availableGranosManchados: boolean;
    percentGranosManchados: number;
    toleranceGranosManchados: number;
    showToleranceGranosManchados: boolean;
    groupToleranceGranosManchados: boolean;

    availableHualcacho: boolean;
    percentHualcacho: number;
    toleranceHualcacho: number;
    showToleranceHualcacho: boolean;
    groupToleranceHualcacho: boolean;

    availableGranosPelados: boolean;
    percentGranosPelados: number;
    toleranceGranosPelados: number;
    showToleranceGranosPelados: boolean;
    groupToleranceGranosPelados: boolean;

    availableGranosYesosos: boolean;
    percentGranosYesosos: number;
    toleranceGranosYesosos: number;
    showToleranceGranosYesosos: boolean;
    groupToleranceGranosYesosos: boolean;

    availableVano: boolean;
    percentVano: number;
    toleranceVano: number;
    showToleranceVano: boolean;
    groupToleranceVano: boolean;

    availableBonificacion: boolean;
    toleranceBonificacion: number;

    availableSecado: boolean;
    percentSecado: number;

    default: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export type UpdateReceptionPayload = {
  producerId?: number;
  riceTypeId?: number;
  discountTemplateId?: number;
  price?: number;
  guide?: string;
  licensePlate?: string;
  grossWeight?: number;
  tare?: number;
  netWeight?: number;
  percentHumedad?: number;
  toleranceHumedad?: number;
  percentGranosVerdes?: number;
  toleranceGranosVerdes?: number;
  percentImpurezas?: number;
  toleranceImpurezas?: number;
  percentGranosManchados?: number;
  toleranceGranosManchados?: number;
  percentHualcacho?: number;
  toleranceHualcacho?: number;
  percentGranosPelados?: number;
  toleranceGranosPelados?: number;
  percentGranosYesosos?: number;
  toleranceGranosYesosos?: number;
  toleranceBonificacion?: number;
  percentSecado?: number;
  totalToPay?: number;
  status?: "pending" | "settled" | "canceled";
  note?: string;
};

// Keys for each defect parameter
export const paramKeys = [
  "Humedad",
  "GranosVerdes",
  "Impurezas",
  "GranosManchados",
  "GranosPelados",
  "GranosYesosos",
  "Vano",
] as const;
export type ParamKey = (typeof paramKeys)[number];

// Entry for displaying in a table
export interface ParamTableEntry {
  key: ParamKey;
  percent: number;
  tolerance: number;
  penalty: number;
}



export interface DataReceptionContextType {
  id: number;

  // Producer
  producerId: number;
  producerName: string;
  producerBusinessName: string;
  producerRut: string;
  producerAddress: string;

  // Rice type

  riceTypeId: number;
  riceTypeName: string;
  riceTypeDescription: string;
  riceTypePrice: string;
  riceTypeEnable: boolean;

  // Reception
  price: number;
  guide: string;
  licensePlate: string;
  note: string;
  status: "pending" | "settled" | "canceled";
  discountTemplateId: number;
  createdAt: string;
  updatedAt: string;
  useToleranceGroup: boolean;

  // Weights and totals
  grossWeight: number;
  tare: number;
  netWeight: number;
  totalBonus: number;
  totalDiscounts: number;
  totalPaddy: number;
  totalToPay: number;

  // Individual defect parameters
  percentHumedad: number;
  toleranceHumedad: number;
  penaltyHumedad: number;

  percentGranosVerdes: number;
  toleranceGranosVerdes: number;
  penaltyGranosVerdes: number;

  percentImpurezas: number;
  toleranceImpurezas: number;
  penaltyImpurezas: number;

  percentVano: number;
  toleranceVano: number;
  penaltyVano: number;

  percentHualcacho: number;
  toleranceHualcacho: number;
  penaltyHualcacho: number;

  percentGranosManchados: number;
  toleranceGranosManchados: number;
  penaltyGranosManchados: number;

  percentGranosPelados: number;
  toleranceGranosPelados: number;
  penaltyGranosPelados: number;

  percentGranosYesosos: number;
  toleranceGranosYesosos: number;
  penaltyGranosYesosos: number;

  // Aggregated parameters
  percentToleranceGroup: number;
  toleranceToleranceGroup: number;
  penaltyToleranceGroup: number;

  percentTotalAnalisis: number;
  toleranceTotalAnalisis: number;
  penaltyTotalAnalisis: number;

  // Bonus and drying
  toleranceBonus: number;
  penaltyBonus: number;

  percentDry: number;

  // Relationships
  producer: {
    id: number;
    name: string;
    businessName: string;
    rut: string;
    address: string;
  };
  riceType: {
    id: number;
    name: string;
    description: string;
    price: string;
    enable: boolean;
  };
  template: TemplateType;

 
}


export const defaultReceptionData: DataReceptionContextType = {
  id: 0,

  // Producer
  producerId: 0,
  producerName: "",
  producerBusinessName: "",
  producerRut: "",
  producerAddress: "",

  // Rice type
  riceTypeId: 0,
  riceTypeName: "",
  riceTypeDescription: "",
  riceTypePrice: "",
  riceTypeEnable: false,

  // Reception
  price: 0,
  guide: "",
  licensePlate: "",
  note: "Sin observaciones.",
  status: "pending",
  discountTemplateId: 0,
  createdAt: "",
  updatedAt: "",
  useToleranceGroup: false,

  // Weights and totals
  grossWeight: 0,
  tare: 0,
  netWeight: 0,
  totalBonus: 0,
  totalDiscounts: 0,
  totalPaddy: 0,
  totalToPay: 0,

  // Individual defect parameters
  percentHumedad: 0,
  toleranceHumedad: 0,
  penaltyHumedad: 0,

  percentGranosVerdes: 0,
  toleranceGranosVerdes: 0,
  penaltyGranosVerdes: 0,

  percentImpurezas: 0,
  toleranceImpurezas: 0,
  penaltyImpurezas: 0,

  percentVano: 0,
  toleranceVano: 0,
  penaltyVano: 0,

  percentHualcacho: 0,
  toleranceHualcacho: 0,
  penaltyHualcacho: 0,

  percentGranosManchados: 0,
  toleranceGranosManchados: 0,
  penaltyGranosManchados: 0,

  percentGranosPelados: 0,
  toleranceGranosPelados: 0,
  penaltyGranosPelados: 0,

  percentGranosYesosos: 0,
  toleranceGranosYesosos: 0,
  penaltyGranosYesosos: 0,

  // Aggregated parameters
  percentToleranceGroup: 0,
  toleranceToleranceGroup: 0,
  penaltyToleranceGroup: 0,

  percentTotalAnalisis: 0,
  toleranceTotalAnalisis: 0,
  penaltyTotalAnalisis: 0,

  // Bonus and drying
  toleranceBonus: 0,
  penaltyBonus: 0,

  percentDry: 0,

  // Relationships
  producer: {
    id: 0,
    name: "",
    businessName: "",
    rut: "",
    address: "",
  },
  riceType: {
    id: 0,
    name: "",
    description: "",
    price: "",
    enable: false,
  },

  // Template (TemplateType)
  template: {
    id: 0,
    name: "",
    useToleranceGroup: false,
    groupToleranceValue: 0,
    producerId: 0,

    availableHumedad: false,
    percentHumedad: 0,
    toleranceHumedad: 0,
    showToleranceHumedad: false,
    groupToleranceHumedad: false,

    availableGranosVerdes: false,
    percentGranosVerdes: 0,
    toleranceGranosVerdes: 0,
    showToleranceGranosVerdes: false,
    groupToleranceGranosVerdes: false,

    availableImpurezas: false,
    percentImpurezas: 0,
    toleranceImpurezas: 0,
    showToleranceImpurezas: false,
    groupToleranceImpurezas: false,

    availableGranosManchados: false,
    percentGranosManchados: 0,
    toleranceGranosManchados: 0,
    showToleranceGranosManchados: false,
    groupToleranceGranosManchados: false,

    availableHualcacho: false,
    percentHualcacho: 0,
    toleranceHualcacho: 0,
    showToleranceHualcacho: false,
    groupToleranceHualcacho: false,

    availableGranosPelados: false,
    percentGranosPelados: 0,
    toleranceGranosPelados: 0,
    showToleranceGranosPelados: false,
    groupToleranceGranosPelados: false,

    availableGranosYesosos: false,
    percentGranosYesosos: 0,
    toleranceGranosYesosos: 0,
    showToleranceGranosYesosos: false,
    groupToleranceGranosYesosos: false,

    availableVano: false,
    percentVano: 0,
    toleranceVano: 0,
    showToleranceVano: false,
    groupToleranceVano: false,

    availableBonus: false,
    toleranceBonus: 0,

    availableDry: false,
    percentDry: 0,

    // optional fields
    default: false,
    createdAt: "",
    updatedAt: "",
    deletedAt: null,
    producer: undefined,
  } 
}
