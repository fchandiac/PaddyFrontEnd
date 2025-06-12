import React, { useEffect, useState, useMemo } from "react";
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

  // Memoizamos el initialState para que sólo se regenere
  // cuando cambie initialData.id
  const memoInitialState = useMemo(
    () => ({
      start: initialData.start,
      end: initialData.end,
      percent: initialData.percent,
    }),
    [initialData.id]
  );

  const handleUpdate = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    // No ejecute ningún setState que no sea estrictamente necesario aquí,
    // para no forzar un rerender de BaseUpdateForm antes del await.
    setErrors([]);

    try {
      const result = await updateDiscountPercent(initialData.id, values);

      if (result?.error) {
        setErrors(
          Array.isArray(result.message)
            ? result.message
            : [result.message]
        );
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
      initialState={memoInitialState}     // <-- aquí usamos la versión memoizada
      fields={[
        { name: "start",   label: "Desde (%)",  type: "number", required: true },
        { name: "end",     label: "Hasta (%)",  type: "number", required: true },
        { name: "percent", label: "Descuento (%)", type: "number", required: true },
      ]}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
