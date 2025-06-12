"use client";

import { useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { updateProducer } from "@/app/actions/producer";
import { useAlertContext } from "@/context/AlertContext";
import { createRecord } from "@/app/actions/record";
import { useUserContext } from "@/context/UserContext";
import { Producer } from "@/types/producer";

interface UpdateProducerFormProps {
  initialData: Producer;
  afterSubmit: () => void;
}

export const UpdateProducerForm: React.FC<UpdateProducerFormProps> = ({
  initialData,
  afterSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();

  const handleUpdate = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await updateProducer(initialData.id, values);

      if (result?.error) {
        setErrors([result.error]);
      } else {
        await createRecord({
          userId: user?.id ?? null,
          entity: "productores",
          description: `Actualización del productor ${values.name} (${initialData.rut})`,
        });

        showAlert("Productor actualizado correctamente", "success");
        afterSubmit();
      }
    } catch (error) {
      setErrors(["Error inesperado al actualizar el productor"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseUpdateForm
      title="Productor"
      initialState={{
        name: initialData.name,
        businessName: initialData.businessName,
        rut: initialData.rut,
        address: initialData.address,
        phone: initialData.phone,
      }}
      fields={[
        { name: "name", label: "Nombre", type: "text", required: true },
        {
          name: "businessName",
          label: "Razón Social",
          type: "text",
          required: true,
        },
        {
          name: "rut",
          label: "RUT",
          type: "text",
          required: true,
          formatFn: (input: string) => {
            const cleaned = input
              .toUpperCase()
              .replace(/[^0-9K]/g, "")
              .slice(0, 9);
            if (cleaned.length <= 1) return cleaned;
            const body = cleaned.slice(0, -1);
            const dv = cleaned.slice(-1);
            return `${body}-${dv}`;
          },
        },
        { name: "address", label: "Dirección", type: "text", required: false },
        {
          name: "phone",
          label: "Teléfono",
          type: "text",
          required: false,
          startAdornment: "+56",
          formatFn: (input: string) => input.replace(/\D/g, "").slice(0, 9),
        },
      ]}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
