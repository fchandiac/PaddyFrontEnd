
/**
 * Un adelanto otorgado a un productor, asociado a una cuenta bancaria.
 */
export interface Advance {
    /** Identificador del adelanto */
    id: number;
  
    /** ID del productor beneficiario */
    producerId: number;
  
    /** Nombre del banco */
    bank: string;
  
    /** Número de cuenta */
    accountNumber: string;
  
    /** Tipo de cuenta bancaria */
    accountType: 'corriente' | 'vista' | 'término' | string;
  
    /** Documento que respalda el adelanto (opcional) */
    document?: string;
  
    /** Fecha del documento/transacción */
    documentDate: Date;
  
    /** Medio de pago empleado */
    paymentType: 'cheque' | 'transferencia' | 'efectivo' | string;
  
    /** Monto principal del adelanto */
    amount: number;
  
    /** Tasa de interés simple anual (por ejemplo, 0.12 = 12%) */
    interestRate: number;
  
    /** Fecha de creación */
    createdAt: Date;
  
    /** Fecha de última actualización (opcional) */
    updatedAt?: Date;
  
    /**
     * Calcula el interés simple desde la fecha del adelanto
     * (documentDate) hasta la fecha indicada.
     * @param toDate Fecha límite para el cálculo.
     * @returns Monto de interés generado.
     */
    calculateInterestUntil(toDate: Date): number;
  
    /**
     * Calcula el interés simple desde la fecha del adelanto
     * hasta hoy.
     * @returns Monto de interés generado.
     */
    calculateInterestUntilToday(): number;
  }
  




export class AdvanceEntity implements Advance {
    constructor(
      public id: number,
      public producerId: number,
      public bank: string,
      public accountNumber: string,
      public accountType: 'corriente' | 'vista' | 'término' | string,
      public documentDate: Date,
      public paymentType: 'cheque' | 'transferencia' | 'efectivo' | string,
      public amount: number,
      public interestRate: number,
      public createdAt: Date,
      public updatedAt?: Date,
      public document?: string,
    ) {}
  
    calculateInterestUntil(toDate: Date): number {
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.floor((toDate.getTime() - this.documentDate.getTime()) / msPerDay);
      // interés simple = principal * rate (anual) * (días/365)
      return this.amount * this.interestRate * (days / 365);
    }
  
    calculateInterestUntilToday(): number {
      return this.calculateInterestUntil(new Date());
    }
  }
  