'use server';

import { DiscountTemplate } from '@/types/discount-template';

const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/discount-templates`;

export async function createDiscountTemplate(
  data: Omit<DiscountTemplate, 'id'>
): Promise<DiscountTemplate | { error: string }> {
  try {
    const res = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      return { error };
    }

    return await res.json();
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function getAllDiscountTemplates(): Promise<DiscountTemplate[]> {
  const res = await fetch(`${baseUrl}`, { cache: 'no-store' });
  return res.json();
}

export async function getDiscountTemplatesByProducer(
  producerId: number
): Promise<DiscountTemplate[]> {
  const res = await fetch(`${baseUrl}/producer/${producerId}`, {
    cache: 'no-store',
  });
  return res.json();
}

export async function deleteDiscountTemplate(id: number): Promise<void> {
  await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  });
}
