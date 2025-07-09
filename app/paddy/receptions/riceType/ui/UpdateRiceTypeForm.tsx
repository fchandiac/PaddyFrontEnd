"use client";

import { useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { updateRiceType } from "@/app/actions/rice-type";
import { useAlertContext } from "@/context/AlertContext";
import { useUser } from "@/hooks/useUser";
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
  const { user } = useUser();

  const handleUpdate = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const dataWithUser = {
        ...values,
        userId: user?.id,
      };

      const result = await updateRiceType(initialData.id, dataWithUser);

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
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        enable: initialData.enable,
      }}
      fields={[
        { name: "code", label: "Código", type: "number", required: true },
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
