import { ZodError } from 'zod';

export function zodErrorMessage(error: ZodError<any>): string {
  // 1. Cas objet : fieldErrors (plus joli quand on sait le champ précis)
  const flattened = error.flatten();
  const fieldErrors = flattened.fieldErrors;

  for (const key in fieldErrors) {
    const message = fieldErrors[key]?.[0];
    if (message) return message;
  }

  // 2. Cas schéma simple
  if (flattened.formErrors[0]) {
    return flattened.formErrors[0];
  }

  // 3. fallback
  return 'Certains champs sont invalides.';
}
