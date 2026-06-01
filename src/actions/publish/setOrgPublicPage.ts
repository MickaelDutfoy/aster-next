'use server';
import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const setOrgPublicPage = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await isOrgAdmin();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const orgId = guard.orgId;

  const slug = formData.get('slug')?.toString().trim();
  const isPublished = formData.has('isPublished');

  if (!slug) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.requiredFieldsMissing',
    };
  }

  try {
    await prisma.organizationPublicPage.upsert({
      where: {
        orgId,
      },
      update: {
        slug,
        isPublished,
      },
      create: {
        orgId,
        slug,
        isPublished,
      },
    });

    revalidatePath('/publish');

    return { ok: true, status: 'success', message: 'toasts.publicPageDataSubmitted' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
