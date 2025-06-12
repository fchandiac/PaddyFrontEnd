"use client";

import { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { createRiceType } from "@/app/actions/rice-type";
import { useAlertContext } from "@/context/AlertContext";

const initialForm = {
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

  const save = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await createRiceType(formData);

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
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={save}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
