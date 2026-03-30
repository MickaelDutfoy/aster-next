'use server';

import { isOrgSuperAdmin } from '@/lib/permissions/isOrgSuperAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const editOrg = async (orgId: number, formData: FormData): Promise<ActionValidation> => {
  const guard = await isOrgSuperAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;

  const name = formData.get('name')?.toString().trim();
  const description = formData.get('description')?.toString().trim();
  const defaultCurrency = formData.get('defaultCurrency')?.toString().trim();

  if (!name || !defaultCurrency) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.orgNameRequired',
    };
  }

  try {
    await prisma.organization.update({
      where: { id: orgId },
      data: { name, description, defaultCurrency },
    });

    revalidatePath(`/organizations/${orgId}`);

    return { ok: true, status: 'success', message: 'toasts.orgEditSuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.errorGeneric' };
  }
};
