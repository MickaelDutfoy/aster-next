import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, { message: 'auth.zod.firstName.minLength' }),
    lastName: z.string().trim().min(2, { message: 'auth.zod.lastName.minLength' }),
    email: z.email({ message: 'auth.zod.email.invalid' }),
    phoneNumber: z
      .string()
      .trim()
      .min(6, { message: 'auth.zod.phone.minLength' })
      .max(20, { message: 'auth.zod.phone.maxLength' })
      .refine((val) => /^[0-9+().\s-]+$/.test(val), { message: 'auth.zod.phone.invalid' }),
    password: z.string().min(8, { message: 'auth.zod.password.minLength' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'auth.zod.passwordConfirm.mismatch',
  });

export const resetPasswordSchema = z.email({ message: 'auth.zod.email.invalid' });

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'auth.zod.password.minLength' }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'auth.zod.passwordConfirm.mismatch',
  });

export const editProfileSchema = z.object({
  firstName: z.string().trim().min(2, { message: 'auth.zod.firstName.minLength' }),
  lastName: z.string().trim().min(2, { message: 'auth.zod.lastName.minLength' }),
  phoneNumber: z
    .string()
    .trim()
    .min(6, { message: 'auth.zod.phone.minLength' })
    .max(20, { message: 'auth.zod.phone.maxLength' })
    .refine((val) => /^[0-9+().\s-]+$/.test(val), { message: 'auth.zod.phone.invalid' }),
});