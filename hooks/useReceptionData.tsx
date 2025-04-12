import { useState } from "react";

export interface ReceptionData {
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
  penaltyHumedad: number;

  percentGranosVerdes: number;
  toleranceGranosVerdes: number;
  penaltyGranosVerdes: number;

  percentImpurezas: number;
  toleranceImpurezas: number;
  penaltyImpurezas: number;

  percentGranosManchados: number;
  toleranceGranosManchados: number;
  penaltyGranosManchados: number;

  percentHualcacho: number;
  toleranceHualcacho: number;
  penaltyHualcacho: number;

  percentGranosPelados: number;
  toleranceGranosPelados: number;
  penaltyGranosPelados: number;

  percentGranosYesosos: number;
  toleranceGranosYesosos: number;
  penaltyGranosYesosos: number;

  percentBonificacion: number;
  toleranceBonificacion: number;
  weightBonificacion: number;

  percentSecado: number;

  totalDiscounts: number;
  postTotal: number;
  totalToPay: number;

  note: string;
}

const initialReceptionData: ReceptionData = {
  producerId: 0,
  riceTypeId: 0,
  price: 0,
  guide: "",
  licensePlate: "",
  grossWeight: 0,
  tare: 0,
  netWeight: 0,

  percentHumedad: 0,
  toleranceHumedad: 0,
  penaltyHumedad: 0,

  percentGranosVerdes: 0,
  toleranceGranosVerdes: 0,
  penaltyGranosVerdes: 0,

  percentImpurezas: 0,
  toleranceImpurezas: 0,
  penaltyImpurezas: 0,

  percentGranosManchados: 0,
  toleranceGranosManchados: 0,
  penaltyGranosManchados: 0,

  percentHualcacho: 0,
  toleranceHualcacho: 0,
  penaltyHualcacho: 0,

  percentGranosPelados: 0,
  toleranceGranosPelados: 0,
  penaltyGranosPelados: 0,

  percentGranosYesosos: 0,
  toleranceGranosYesosos: 0,
  penaltyGranosYesosos: 0,

  percentBonificacion: 0,
  toleranceBonificacion: 0,
  weightBonificacion: 0,

  percentSecado: 0,

  totalDiscounts: 0,
  postTotal: 0,
  totalToPay: 0,

  note: "",
};

export const useReceptionData = () => {
  const [data, setData] = useState<ReceptionData>(initialReceptionData);

  const updateField = <K extends keyof ReceptionData>(key: K, value: ReceptionData[K]) => {
    setData((prev) => {
      const updated = { ...prev, [key]: value };

      const match = key.match(/^(percent|tolerance)(.+)$/);
      if (match) {
        const [, , label] = match;
        const percentKey = `percent${label}` as keyof ReceptionData;
        const toleranceKey = `tolerance${label}` as keyof ReceptionData;
        const penaltyKey = `penalty${label}` as keyof ReceptionData;

        const percent = (key === percentKey ? value : prev[percentKey]) as number;
        const tolerance = (key === toleranceKey ? value : prev[toleranceKey]) as number;

        const netWeight = updated.netWeight;
        const penalty = percent > tolerance ? ((percent - tolerance) * netWeight) / 100 : 0;
        (updated as any)[penaltyKey] = penalty;
      }

      return recalculate(updated);
    });
  };

  const setMultipleFields = (fields: Partial<ReceptionData>) => {
    setData((prev) => {
      const updated = { ...prev, ...fields };
      return recalculate(updated);
    });
  };

  const resetData = () => setData(initialReceptionData);

  const recalculate = (current: ReceptionData): ReceptionData => {
    const updated = { ...current };

    updated.netWeight = Math.max(0, updated.grossWeight - updated.tare);

    updated.weightBonificacion = parseFloat(
      ((updated.toleranceBonificacion * updated.netWeight) / 100).toFixed(2)
    );

    updated.totalDiscounts = [
      updated.penaltyHumedad,
      updated.penaltyGranosVerdes,
      updated.penaltyImpurezas,
      updated.penaltyGranosManchados,
      updated.penaltyHualcacho,
      updated.penaltyGranosPelados,
      updated.penaltyGranosYesosos,
    ].reduce((sum, v) => sum + v, 0);

    updated.postTotal = updated.netWeight - updated.totalDiscounts + updated.weightBonificacion;
    updated.totalToPay = parseFloat((updated.postTotal * updated.price).toFixed(2));

    return updated;
  };

  const applyAutoPenalties = () => {
    setData((prev) => {
      const updatePenalty = (percent: number, tolerance: number) =>
        percent > tolerance ? ((percent - tolerance) * prev.netWeight) / 100 : 0;

      const updated: ReceptionData = {
        ...prev,
        penaltyHumedad: updatePenalty(prev.percentHumedad, prev.toleranceHumedad),
        penaltyGranosVerdes: updatePenalty(prev.percentGranosVerdes, prev.toleranceGranosVerdes),
        penaltyImpurezas: updatePenalty(prev.percentImpurezas, prev.toleranceImpurezas),
        penaltyGranosManchados: updatePenalty(prev.percentGranosManchados, prev.toleranceGranosManchados),
        penaltyHualcacho: updatePenalty(prev.percentHualcacho, prev.toleranceHualcacho),
        penaltyGranosPelados: updatePenalty(prev.percentGranosPelados, prev.toleranceGranosPelados),
        penaltyGranosYesosos: updatePenalty(prev.percentGranosYesosos, prev.toleranceGranosYesosos),
      };

      return recalculate(updated);
    });
  };

  const getTotalPercentDiscounts = () => {
    return (
      data.percentHumedad +
      data.percentGranosVerdes +
      data.percentImpurezas +
      data.percentGranosManchados +
      data.percentHualcacho +
      data.percentGranosPelados +
      data.percentGranosYesosos
    );
  };

  const getTotalTolerances = () => {
    return (
      data.toleranceHumedad +
      data.toleranceGranosVerdes +
      data.toleranceImpurezas +
      data.toleranceGranosManchados +
      data.toleranceHualcacho +
      data.toleranceGranosPelados +
      data.toleranceGranosYesosos
    );
  };

  const getTotalKgPenalties = () => {
    return (
      data.penaltyHumedad +
      data.penaltyGranosVerdes +
      data.penaltyImpurezas +
      data.penaltyGranosManchados +
      data.penaltyHualcacho +
      data.penaltyGranosPelados +
      data.penaltyGranosYesosos -
      data.weightBonificacion
    );
  };

  const setProducerId = (value: number) => updateField("producerId", value);
  const setRiceTypeId = (value: number) => updateField("riceTypeId", value);
  const setPrice = (value: number) => updateField("price", value);
  const setGuide = (value: string) => updateField("guide", value);
  const setLicensePlate = (value: string) => updateField("licensePlate", value);
  const setGrossWeight = (value: number) => updateField("grossWeight", value);
  const setTare = (value: number) => updateField("tare", value);
  const setPercentHumedad = (value: number) => updateField("percentHumedad", value);
  const setToleranceHumedad = (value: number) => updateField("toleranceHumedad", value);
  const setPercentGranosVerdes = (value: number) => updateField("percentGranosVerdes", value);
  const setToleranceGranosVerdes = (value: number) => updateField("toleranceGranosVerdes", value);
  const setPercentImpurezas = (value: number) => updateField("percentImpurezas", value);
  const setToleranceImpurezas = (value: number) => updateField("toleranceImpurezas", value);
  const setPercentGranosManchados = (value: number) => updateField("percentGranosManchados", value);
  const setToleranceGranosManchados = (value: number) => updateField("toleranceGranosManchados", value);
  const setPercentHualcacho = (value: number) => updateField("percentHualcacho", value);
  const setToleranceHualcacho = (value: number) => updateField("toleranceHualcacho", value);
  const setPercentGranosPelados = (value: number) => updateField("percentGranosPelados", value);
  const setToleranceGranosPelados = (value: number) => updateField("toleranceGranosPelados", value);
  const setPercentGranosYesosos = (value: number) => updateField("percentGranosYesosos", value);
  const setToleranceGranosYesosos = (value: number) => updateField("toleranceGranosYesosos", value);
  const setToleranceBonificacion = (value: number) => updateField("toleranceBonificacion", value);
  const setPercentBonificacion = (value: number) => updateField("percentBonificacion", value);
  const setPercentSecado = (value: number) => updateField("percentSecado", value);
  const setNote = (value: string) => updateField("note", value);

  return {
    data,
    updateField,
    setMultipleFields,
    resetData,
    applyAutoPenalties,
    getTotalPercentDiscounts,
    getTotalTolerances,
    getTotalKgPenalties,
    setProducerId,
    setRiceTypeId,
    setPrice,
    setGuide,
    setLicensePlate,
    setGrossWeight,
    setTare,
    setPercentHumedad,
    setToleranceHumedad,
    setPercentGranosVerdes,
    setToleranceGranosVerdes,
    setPercentImpurezas,
    setToleranceImpurezas,
    setPercentGranosManchados,
    setToleranceGranosManchados,
    setPercentHualcacho,
    setToleranceHualcacho,
    setPercentGranosPelados,
    setToleranceGranosPelados,
    setPercentGranosYesosos,
    setToleranceGranosYesosos,
    setToleranceBonificacion,
    setPercentBonificacion,
    setPercentSecado,
    setNote,
  };
};
