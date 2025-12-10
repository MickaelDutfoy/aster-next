import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
    lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.'),
    email: z.email("L'adresse e-mail n'est pas valide."),
    phoneNumber: z
      .string()
      .trim()
      .min(6, 'Le numéro de téléphone doit contenir au moins 6 caractères.')
      .max(20, 'Le numéro de téléphone est trop long.')
      .refine((val) => /^[0-9+().\s-]+$/.test(val), 'Le numéro de téléphone ne semble pas valide.'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Les mots de passe ne correspondent pas.',
  });

// export type RegisterInput = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.email("L'adresse e-mail n'est pas valide.");

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Les mots de passe ne correspondent pas.',
  });
