"use server";
const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";


export async function createUser(data: {
  name: string;
  email: string;
  pass?: string;
  role: string;
}) {
  try {
    const res = await fetch(`${backendUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al crear el usuario");
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getAllUsers() {
  try {
    const res = await fetch(`${backendUrl}/users`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return await res.json();
  } catch (error: any) {
    return { error: error.message  || "Error al obtener usuarios"};
  }
}

export async function getUserById(id: number) {
  try {
    const res = await fetch(`${backendUrl}/users/id/${id}`);
    if (!res.ok) throw new Error("Usuario no encontrado");
    return await res.json();
  } catch (error: any) {
    return { error: error.message || "Error al obtener el usuario" };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const res = await fetch(`${backendUrl}/users/email/${email}`);
    if (!res.ok) throw new Error("Usuario no encontrado");
    return await res.json();
  } catch (error: any) {
    return { error: error.message || "Error al obtener el usuario" };
  }
}

export async function getUserByName(name: string) {
  try {
    const res = await fetch(`${backendUrl}/users/name/${name}`);
    if (!res.ok) throw new Error("No se encontraron usuarios");
    return await res.json();
  } catch (error: any) {
    return { error: error.message || "Error al obtener el usuario" };
  }
}

export async function updateUserPassword(data: {
  userId: number;
  newPassword: string;
}) {
  try {
    const res = await fetch(`${backendUrl}/users/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al actualizar contraseña");
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await fetch(`${backendUrl}/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al eliminar el usuario");
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

//  // ✅ Actualizar usuario
//  @Put()
//  updateUser(@Body() dto: UpdateUserDto) {
//    return this.userService.updateUser(dto);
//  }

export async function updateUser(id: number, name: string, email: string, role: string)  {
  try {
    const res = await fetch(`${backendUrl}/users/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email, role }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al actualizar el usuario");
    }

    return await res.json();
  } catch (error: any) {
    return { error: error.message };
  }
}
