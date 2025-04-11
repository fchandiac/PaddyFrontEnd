'use server';

export async function loginUser(email: string, pass: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, pass }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Error al iniciar sesión');
    }

    const { user } = await res.json();
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Error desconocido');
  }
}
