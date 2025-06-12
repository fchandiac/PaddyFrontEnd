
  

  export interface Param {
    name: string;
    available: boolean;
    percent: number;
    tolerance: number;
    showTolerance: boolean;
    groupTolerance: boolean;
  }

  export interface ParamTemplate {
    name: string;
    available: boolean;
    percent: number;
    tolerance: number;
    showTolerance: boolean;
    groupTolerance: boolean;
    setAvailable: (value: boolean) => void;
    setShowTolerance: (value: boolean) => void ;
    setGroupTolerance: (value: boolean) => void ;
    setPercent: (value: number) => void;
    setTolerance: (value: number) => void;
  }


  export type TemplateType = {
    id: number;
    name: string;
    useToleranceGroup: boolean;
    groupToleranceValue: number;
    
    producerId: number;

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

    availableBonus: boolean;
    toleranceBonus: number;
    
    availableDry: boolean;
    percentDry: number;
    default?: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    producer?: {
      id: number;
      name: string;
      businessName: string;
      rut: string;
      address?: string;
      phone?: string;
      bankAccounts?: any;
      createdAt?: string;
      updatedAt?: string;
      deletedAt?: string | null;
    };
  };
  

  export type CreateTemplateType = {
    name: string;
    producerId?: number;
    useToleranceGroup?: boolean;
    groupToleranceValue?: number;
  
    availableHumedad?: boolean;
    percentHumedad?: number;
    toleranceHumedad?: number;
    showToleranceHumedad?: boolean;
    groupToleranceHumedad?: boolean;
  
    availableGranosVerdes?: boolean;
    percentGranosVerdes?: number;
    toleranceGranosVerdes?: number;
    showToleranceGranosVerdes?: boolean;
    groupToleranceGranosVerdes?: boolean;
  
    availableImpurezas?: boolean;
    percentImpurezas?: number;
    toleranceImpurezas?: number;
    showToleranceImpurezas?: boolean;
    groupToleranceImpurezas?: boolean;
  
    availableGranosManchados?: boolean;
    percentGranosManchados?: number;
    toleranceGranosManchados?: number;
    showToleranceGranosManchados?: boolean;
    groupToleranceGranosManchados?: boolean;
  
    availableHualcacho?: boolean;
    percentHualcacho?: number;
    toleranceHualcacho?: number;
    showToleranceHualcacho?: boolean;
    groupToleranceHualcacho?: boolean;
  
    availableGranosPelados?: boolean;
    percentGranosPelados?: number;
    toleranceGranosPelados?: number;
    showToleranceGranosPelados?: boolean;
    groupToleranceGranosPelados?: boolean;
  
    availableGranosYesosos?: boolean;
    percentGranosYesosos?: number;
    toleranceGranosYesosos?: number;
    showToleranceGranosYesosos?: boolean;
    groupToleranceGranosYesosos?: boolean;
  
    availableVano?: boolean;
    percentVano?: number;
    toleranceVano?: number;
    showToleranceVano?: boolean;
    groupToleranceVano?: boolean;
  
    availableBonificacion?: boolean;
    toleranceBonificacion?: number;
  
    availableSecado?: boolean;
    percentSecado?: number;
  };
  




  


  