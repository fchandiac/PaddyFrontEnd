"use client";

import { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { createRiceType } from "@/app/actions/rice-type";
import { useAlertContext } from "@/context/AlertContext";
import { useUser } from "@/hooks/useUser";

const initialForm = {
  code: 0,
  name: "",
  description: "",
  price: 0,
  enable: true,
};

export const CreateRiceTypeForm = ({ afterSubmit }: { afterSubmit: () => void }) => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { showAlert } = useAlertContext();
  const { user } = useUser();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const save = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const dataWithUser = {
        ...formData,
        userId: user?.id,
      };

      const result = await createRiceType(dataWithUser);

      if (result?.error) {
        setErrors(Array.isArray(result.message) ? result.message : [result.error]);
        return;
      }

      showAlert("Tipo de arroz creado correctamente", "success");
      afterSubmit();
      setFormData(initialForm);
    } catch (err) {
      setErrors(["Error inesperado al guardar el tipo de arroz"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseForm
      title="Tipo de Arroz"
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
      values={formData}
      errors={errors}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={save}
    />
  );
};
