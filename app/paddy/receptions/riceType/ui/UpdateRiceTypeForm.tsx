"use client";

import { useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { updateRiceType } from "@/app/actions/rice-type";
import { useAlertContext } from "@/context/AlertContext";
import { RiceType } from "@/types/rice-type";

interface UpdateRiceTypeFormProps {
  initialData: RiceType;
  afterSubmit: () => void;
}

export const UpdateRiceTypeForm: React.FC<UpdateRiceTypeFormProps> = ({
  initialData,
  afterSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { showAlert } = useAlertContext();

  const handleUpdate = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await updateRiceType(initialData.id, values);

      if (result?.error) {
        setErrors([result.error]);
      } else {
        showAlert("Tipo de arroz actualizado correctamente", "success");
        afterSubmit();
      }
    } catch (error) {
      setErrors(["Error inesperado al actualizar el tipo de arroz"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseUpdateForm
      title="Tipo de Arroz"
      initialState={{
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        enable: initialData.enable,
      }}
      fields={[
        { name: "name", label: "Nombre", type: "text", required: true },
        { name: "description", label: "Descripción", type: "text" },
        { name: "price", label: "Precio (CLP)", type: "number", required: true },
        {
          name: "enable",
          label: "¿Habilitado?",
          type: "switch",
        },
      ]}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
