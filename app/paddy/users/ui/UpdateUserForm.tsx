"use client";

import { useState } from "react";
import { BaseUpdateForm } from "@/components/appForm/UpdateBaseForm";
import { updateUser } from "@/app/actions/user";
import { User } from "@/types/user";
import { useUserContext } from "@/context/UserContext";
import { createRecord } from "@/app/actions/record";
import { useAlertContext } from "@/context/AlertContext";

const roles = [
  { id: "administrador", name: "Administrador" },
  { id: "contador", name: "Contador" },
  { id: "operador", name: "Operador" },
];

interface UpdateUserFormProps {
  initialData: User;
  afterSubmit: () => void;
}

export const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  initialData,
  afterSubmit,
}) => {
  if (!initialData) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { user } = useUserContext();
  const { showAlert } = useAlertContext();

  const handleUpdate = async (values: Record<string, any>) => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const res = await updateUser(
        initialData.id,
        values.name,
        initialData.email, // el email no se edita, se mantiene
        values.role
      );

      if (res.error) {
        setErrors([res.error]);
      } else {
        // ✅ Registrar en la bitácora (Record)
        await createRecord({
          userId: user?.id ?? null,
          entity: "usuarios",
          description: `Actualización de usuario ${values.name} (${initialData.email}) con rol "${values.role}"`,
        });

        showAlert("Usuario actualizado correctamente", "success");
        afterSubmit();
      }
    } catch (error) {
      setErrors(["Error inesperado al actualizar el usuario"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseUpdateForm
      title="Usuario"
      initialState={{
        name: initialData.name,
        email: initialData.email,
        role: initialData.role,
      }}
      fields={[
        { name: "name", label: "Nombre", type: "text", required: true },
        {
          name: "email",
          label: "Correo electrónico",
          type: "email",
          required: true,
          disabled: true,
        },
        {
          name: "role",
          label: "Rol",
          type: "autocomplete",
          options: roles,
          required: true,
        },
      ]}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      errors={errors}
    />
  );
};
