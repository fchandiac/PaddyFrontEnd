"use client";

import { useState } from "react";
import { BaseForm } from "@/components/appForm/CreateBaseForm";
import { createUser } from "@/app/actions/user";
import { useUserContext } from "@/context/UserContext";
import { createRecord } from "@/app/actions/record";
import { useAlertContext } from "@/context/AlertContext";
const initialForm = {
  name: "",
  email: "",
  role: "",
};

const roles = [
  { id: "administrador", name: "Administrador" },
  { id: "contador", name: "Contador" },
  { id: "operador", name: "Operador" },
];

interface UserFormProps {
  afterSubmit: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ afterSubmit }) => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();

  const saveUser = async () => {
    setIsSubmitting(true);
    setErrors([]); // limpia errores anteriores

    try {
      const result = await createUser({
        ...formData,
        pass: "1234", // Contraseña por defecto
      });

      // Guardar el registro de creación en la base de datos
      await createRecord({
        userId: user?.id ?? null,
        entity: 'usuarios',
        description: `Creación de usuario ${formData.name} (${formData.email})`
      });

      if (result?.error) {
        // Soporte para mensaje múltiple desde backend tipo class-validator
        if (Array.isArray(result.message)) {
          setErrors(result.message); // errores como array
        } else {
          setErrors([result.error]); // error simple como string
        }
        return;
      }

      // Todo bien
      afterSubmit();
      setFormData(initialForm);
      showAlert("Usuario creado correctamente", "success");
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrors(["Error inesperado al guardar usuario"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseForm
      title="Usuario"
      fields={[
        { name: "name", label: "Nombre", type: "text", required: true },
        {
          name: "email",
          label: "Correo electrónico",
          type: "email",
          required: true,
        },
        {
          name: "role",
          label: "Rol",
          type: "autocomplete",
          options: roles,
          required: true,
        },
      ]}
      values={formData}
      onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      onSubmit={saveUser}
      isSubmitting={isSubmitting}
      errors={errors} // ⬅️ los errores del backend se pasan al BaseForm
    />
  );
};
