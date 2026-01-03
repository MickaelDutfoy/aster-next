'use server';

import { canEditOrDeleteOrg } from '@/lib/permissions/canEditOrDeleteOrg';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const editOrg = async (orgId: number, formData: FormData): Promise<ActionValidation> => {
  const guard = await canEditOrDeleteOrg(orgId);
  if (!guard.ok) return guard;

  const newOrgName = formData.get('newOrgName')?.toString().trim();

  if (!newOrgName) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.orgNameRequired',
    };
  }

  try {
    await prisma.organization.update({
      where: { id: orgId },
      data: { name: newOrgName },
    });

    revalidatePath(`/organizations/${orgId}`);

    return { ok: true, status: 'success', message: 'toasts.orgEditSuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.genericError' };
  }
};
