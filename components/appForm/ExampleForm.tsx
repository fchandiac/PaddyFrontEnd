// components/forms/VehicleForm.tsx
"use client";

import { useState } from "react";
import { BaseForm } from "@/components/appForm/BaseForm";

const initialForm = {
  plate: "",
  model: "",
  year: "",
  mileage: "",
};

interface VehicleFormProps {
  afterSubmit: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ afterSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveVehicle = async () => {
    setIsSubmitting(true);
    try {
      // Aquí iría tu request real
      console.log("Guardando vehículo:", formData);
      await new Promise((res) => setTimeout(res, 1000)); // Simula espera

      afterSubmit(); // Cierra el diálogo y refresca (si aplica)
      setFormData(initialForm);
    } catch (error) {
      console.error("Error al guardar vehículo", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseForm
      title="Vehículo"
      update={false} // puedes ajustar esto si agregas edición
      fields={[
        { name: "plate", label: "Patente", type: "text", required: true },
        { name: "model", label: "Modelo", type: "text", required: true },
        { name: "year", label: "Año", type: "number", required: true },
        { name: "mileage", label: "Kilometraje", type: "number", required: true },
      ]}
      values={formData}
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={saveVehicle}
      isSubmitting={isSubmitting}
    />
  );
};
