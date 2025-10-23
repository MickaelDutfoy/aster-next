'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import bcrypt from 'bcryptjs';

export const register = async (formdata: FormData): Promise<ActionValidation> => {
  const newUser = {
    firstName: formdata.get('userFirstName')?.toString(),
    lastName: formdata.get('userLastName')?.toString(),
    email: formdata.get('userEmail')?.toString(),
    phoneNumber: formdata.get('userPhoneNumber')?.toString(),
    password: formdata.get('userPassword')?.toString(),
  };

  if (
    !newUser.firstName ||
    !newUser.lastName ||
    !newUser.email ||
    !newUser.phoneNumber ||
    !newUser.password
  )
    return { ok: false, status: 'error', message: 'Tous les champs doivent être remplis.' };

  const passwordHash = await bcrypt.hash(newUser.password, 12);

  try {
    await prisma.member.create({
      data: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        passwordHash: passwordHash,
      },
    });

    await signIn('credentials', {
      redirect: false,
      email: newUser.email,
      password: newUser.password,
    });

    return { ok: true, status: 'success', message: 'Compte créé avec succès !' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'Une erreur est survenue.' };
  }
};
