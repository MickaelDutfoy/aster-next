'use server';

import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const registerOrg = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  const orgName = formData.get('orgName')?.toString().trim();

  if (!orgName) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.orgNameRequired',
    };
  }

  try {
    const res = await prisma.organization.create({
      data: { name: orgName },
    });

    await prisma.memberOrganization.create({
      data: {
        memberId: userId,
        orgId: res.id,
        role: MemberRole.SUPERADMIN,
        status: MemberStatus.VALIDATED,
      },
    });

    await prisma.member.update({
      where: { id: userId },
      data: { selectedOrgId: res.id },
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: 'toasts.orgRegisterSuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'toasts.errorGeneric' };
  }
};
