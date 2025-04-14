export interface DiscountTemplate {
    id?: number; // si también usas este type para edición
    name: string;
    producerId?: number;
  
    percentHumedad: number;
    toleranceHumedad: number;
    showToleranceHumedad: boolean;
  
    percentGranosVerdes: number;
    toleranceGranosVerdes: number;
    showToleranceGranosVerdes: boolean;
  
    percentImpurezas: number;
    toleranceImpurezas: number;
    showToleranceImpurezas: boolean;
  
    percentGranosManchados: number;
    toleranceGranosManchados: number;
    showToleranceGranosManchados: boolean;
  
    percentHualcacho: number;
    toleranceHualcacho: number;
    showToleranceHualcacho: boolean;
  
    percentGranosPelados: number;
    toleranceGranosPelados: number;
    showToleranceGranosPelados: boolean;
  
    percentGranosYesosos: number;
    toleranceGranosYesosos: number;
    showToleranceGranosYesosos: boolean;
  
    toleranceBonificacion: number;
    percentSecado: number;
  }
  