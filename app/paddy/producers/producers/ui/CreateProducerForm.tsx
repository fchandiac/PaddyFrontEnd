"use client";

import { useState, useRef, useEffect } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import {
  createProducer,
  createProducerWithBankAccount,
} from "@/app/actions/producer";
import { useAlertContext } from "@/context/AlertContext";
import { createRecord } from "@/app/actions/record";
import { useUserContext } from "@/context/UserContext";
import { createTransaction } from "@/app/actions/transaction";
import { TransactionTypeCode } from "@/types/transaction";
import { bankOptions, accountBankTypes } from "@/types/producer"; // asegúrate que estén exportados así
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { usePathname } from "next/navigation";


const initialForm = {
  name: "",
  businessName: "",
  rut: "",
  address: "",
  phone: "",
  bank: "",
  accountType: "",
  accountNumber: "",
  holderName: "",
};

export const CreateProducerForm = ({
  afterSubmit,
}: {
  afterSubmit: () => void;
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();
  const pathname = usePathname();

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const isBankAccountComplete = () => {
    const { bank, accountNumber, accountType, holderName } = formData;
    return bank && accountNumber && accountType && holderName;
  };

  const saveProducer = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      let result;

      if (isBankAccountComplete()) {
        result = await createProducerWithBankAccount(formData);
      } else {
        const { bank, accountNumber, accountType, holderName, ...rest } =
          formData;
        result = await createProducer(rest);
      }

      if (result?.error) {
        setErrors(
          Array.isArray(result.message) ? result.message : [result.error]
        );
        return;
      }

      await createRecord({
        userId: user?.id ?? null,
        entity: "productores",
        description: `Creación de productor ${formData.name} (${formData.rut})`,
      });

      await createTransaction({
        userId: user?.id ?? 0,
        producerId: result.id,
        typeCode: TransactionTypeCode.OPEN_ACCOUNT,
        debit: 0,
        credit: 0,
        balance: 0,
        previousBalance: 0,
        description: "Apertura de cuenta",
        lastTransaction: null,
        isDraft: false,
      });

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
        {
          name: "name",
          label: "Nombre",
          type: "text",
          required: true,
          inputRef: nameInputRef,
        },
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
        // 🏦 Datos de cuenta bancaria opcionales
        {
          name: "bank",
          label: "Banco",
          type: "autocomplete",
          required: false,
          options: bankOptions.map((b: any) => ({ id: b.name, name: b.name })),
        },
        {
          name: "accountType",
          label: "Tipo de cuenta",
          type: "autocomplete",
          required: false,
          options: accountBankTypes.map((a: any) => ({
            id: a.type,
            name: a.type,
          })),
        },
        {
          name: "accountNumber",
          label: "Número de cuenta",
          type: "text",
          required: false,
        },
        {
          name: "holderName",
          label: "Titular",
          type: "text",
          required: false,
        },
      ]}
      values={formData}
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={saveProducer}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
