export interface DiscountPercent {
    id: number;
    discountCode: number;
    start: number;
    end: number;
    percent: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }
  
  export interface CreateDiscountPercentDto {
    discountCode: number;
    start: number;
    end: number;
    percent: number;
  }
  
  export interface UpdateDiscountPercentDto {
    discountCode?: number;
    start?: number;
    end?: number;
    percent?: number;
  }
  