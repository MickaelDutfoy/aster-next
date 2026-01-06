'use server';

import { isUser } from '@/lib/permissions/isUser';
import { prisma } from '@/lib/prisma';
import { editProfileSchema } from '@/lib/schemas/authSchemas';
import { ActionValidation } from '@/lib/types';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';

export const editAccount = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await isUser();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const userId = guard.user.id;

  const userForm = {
    firstName: formData.get('userFirstName')?.toString().trim(),
    lastName: formData.get('userLastName')?.toString().trim(),
    phoneNumber: formData.get('userPhoneNumber')?.toString().trim(),
  };

  const parsedUser = editProfileSchema.safeParse(userForm);

  if (!parsedUser.success) {
    return {
      ok: false,
      status: 'error',
      message: zodErrorMessage(parsedUser.error),
    };
  }

  try {
    await prisma.member.update({
      where: { id: userId },
      data: {
        firstName: parsedUser.data.firstName,
        lastName: parsedUser.data.lastName,
        phoneNumber: parsedUser.data.phoneNumber,
      },
    });

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err: any) {
    console.error(err);

    if (err.code === 'P2002') {
      return {
        ok: false,
        status: 'error',
        message: 'auth.register.alreadyExists',
      };
    }

    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
