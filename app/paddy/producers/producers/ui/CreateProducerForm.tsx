"use client";

import { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { createProducer } from "@/app/actions/producer";
import { useAlertContext } from "@/context/AlertContext";
import { createRecord } from "@/app/actions/record";
import { useUserContext } from "@/context/UserContext";
import { createTransaction } from "@/app/actions/transaction";
import { TransactionTypeCode } from "@/types/transaction";

const initialForm = {
  name: "",
  businessName: "",
  rut: "",
  address: "",
  phone: "",
};

export const CreateProducerForm = ({ afterSubmit }: { afterSubmit: () => void }) => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();

  const saveProducer = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await createProducer(formData);

      if (result?.error) {
        setErrors(Array.isArray(result.message) ? result.message : [result.error]);
        return;
      }

      await createRecord({
        userId: user?.id ?? null,
        entity: "productores",
        description: `Creación de productor ${formData.name} (${formData.rut})`,
      });

      console.log("result", result);

      const trans = await createTransaction({
        userId: user?.id ?? 0,
        producerId: result.id,
        typeCode: TransactionTypeCode.OPEN_ACCOUNT,
        debit: 0,
        credit: 0,
        balance: 0,
        previousBalance: 0,
        description: 'Apertura de cuenta',
        lastTransaction: null,
        isDraft: false,
      });

      console.log(trans)

      showAlert("Productor creado correctamente", "success");
      afterSubmit();
      setFormData(initialForm);
    } catch (err) {
      setErrors(["Error inesperado al guardar el productor"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseForm
      title="Productor"
      fields={[
        { name: "name", label: "Nombre", type: "text", required: true },
        { name: "businessName", label: "Razón Social", type: "text", required: true },
        { name: "rut", label: "RUT", type: "text", required: true },
        { name: "address", label: "Dirección", type: "text", required: true },
        { name: "phone", label: "Teléfono", type: "text", required: true },
      ]}
      values={formData}
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={saveProducer}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
