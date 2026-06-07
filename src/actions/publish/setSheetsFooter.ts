'use server';
import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const setSheetsFooter = async (footer: string): Promise<ActionValidation> => {
  const guard = await isOrgAdmin();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const orgId = guard.orgId;

  try {
    await prisma.organizationPublicPage.update({
      where: {
        orgId,
      },
      data: {
        publicAnimalSheetFooter: footer,
      },
    });

    revalidatePath('/publish');

    return { ok: true, status: 'success', message: 'toasts.sheetsFooterSubmitted' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
