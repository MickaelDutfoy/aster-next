'use server';

import { signIn } from '@/auth';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/schemas/authSchemas';
import { ActionValidation } from '@/lib/types';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import bcrypt from 'bcryptjs';

export const register = async (formdata: FormData): Promise<ActionValidation> => {
  const newUserForm = {
    firstName: formdata.get('userFirstName')?.toString().trim(),
    lastName: formdata.get('userLastName')?.toString().trim(),
    email: formdata.get('userEmail')?.toString().trim(),
    phoneNumber: formdata.get('userPhoneNumber')?.toString().trim(),
    password: formdata.get('userPassword')?.toString(),
    passwordConfirm: formdata.get('userPasswordConfirm')?.toString(),
  };

  const parsedNewUser = registerSchema.safeParse(newUserForm);

  if (!parsedNewUser.success) {
    return {
      ok: false,
      status: 'error',
      message: zodErrorMessage(parsedNewUser.error),
    };
  }

  const newUser = parsedNewUser.data;

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

    await sendEmail({
      to: newUser.email,
      subject: 'Bienvenue sur Aster !',
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px">
                <div style="text-align: center; margin-bottom: 24px">
                  <img
                    src="https://aster-pearl.vercel.app/icons/aster-icon-192.png"
                    alt="Logo Aster"
                    width="64"
                    style="border-radius: 8px"
                  />
                  <h1 style="font-size: 20px; margin: 16px 0 0">Aster</h1>
                </div>

                <p>Bonjour,</p>
                <p>Votre compte sur Aster a bien été créé !</p>

                <p>
                  Aster est une application open-source, gratuite et sans publicité, pensée pour simplifier le
                  travail des associations de protection animale.
                </p>
                <p>
                  Développée par une seule personne, elle évolue progressivement : certaines fonctionnalités
                  arriveront avec le temps et quelques imperfections peuvent subsister — merci pour votre patience
                  et votre indulgence.
                </p>
                <p>
                  Que vous soyez bénévole, famille d’accueil ou membre d’une association, j’espère qu’Aster vous
                  aidera à gagner du temps pour vous concentrer sur l’essentiel : les animaux.
                </p>

                <p>À bientôt sur Aster 🐾</p>
              </div>
            `,
    });

    return { ok: true, status: 'success', message: 'Compte créé avec succès !' };
  } catch (err: any) {
    console.error(err);

    if (err.code === 'P2002') {
      return {
        ok: false,
        status: 'error',
        message: 'Un compte existe déjà avec cette adresse e-mail.',
      };
    }

    return { ok: false, status: 'error', message: 'Une erreur est survenue.' };
  }
};
