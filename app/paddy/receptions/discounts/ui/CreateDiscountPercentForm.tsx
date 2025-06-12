"use client";

import { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { useAlertContext } from "@/context/AlertContext";
import { createDiscountPercent } from "@/app/actions/discount-percent";
import { DiscountPercent } from "@/types/discount-percent";

const initialForm = {
  discountCode: 1,
  start: 0,
  end: 0,
  percent: 0,
};

interface Props {
  defaultCode: number; // para precargar código seleccionado
  afterSubmit: () => void;
}

export const CreateDiscountPercentForm: React.FC<Props> = ({ defaultCode, afterSubmit }) => {
  const [formData, setFormData] = useState({ ...initialForm, discountCode: defaultCode });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { showAlert } = useAlertContext();

  const save = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await createDiscountPercent(formData);

      if (result?.error) {
        setErrors(Array.isArray(result.message) ? result.message : [result.message]);
        return;
      }

      showAlert("Rango de descuento creado correctamente", "success");
      afterSubmit();
      setFormData({ ...initialForm, discountCode: defaultCode });
    } catch (err) {
      setErrors(["Error inesperado al guardar el descuento"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseForm
      title="Descuento"
      fields={[
        {
          name: "start",
          label: "Desde (%)",
          type: "number",
          required: true,
        },
        {
          name: "end",
          label: "Hasta (%)",
          type: "number",
          required: true,
        },
        {
          name: "percent",
          label: "Descuento (%)",
          type: "number",
          required: true,
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
