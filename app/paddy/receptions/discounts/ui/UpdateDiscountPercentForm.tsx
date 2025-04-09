"use client";

import { useEffect, useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { useAlertContext } from "@/context/AlertContext";
import { updateDiscountPercent } from "@/app/actions/discount-percent";
import { DiscountPercent } from "@/types/discount-percent";

interface Props {
  initialData: DiscountPercent;
  afterSubmit: () => void;
}

export const UpdateDiscountPercentForm: React.FC<Props> = ({
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
      const result = await updateDiscountPercent(initialData.id, values);

      if (result?.error) {
        setErrors(Array.isArray(result.message) ? result.message : [result.error]);
        return;
      }

      showAlert("Rango de descuento actualizado correctamente", "success");
      afterSubmit();
    } catch (error) {
      setErrors(["Error inesperado al actualizar el descuento"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseUpdateForm
      title="Descuento"
      initialState={{
        start: initialData.start,
        end: initialData.end,
        percent: initialData.percent,
      }}
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
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
