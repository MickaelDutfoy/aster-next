import { ZodError } from 'zod';

export function zodErrorMessage(error: ZodError<any>): string {
  const flattened = error.flatten();
  const fieldErrors = flattened.fieldErrors;

  for (const key in fieldErrors) {
    const message = fieldErrors[key]?.[0];
    if (message) {
      return message;
    }
  }

  if (flattened.formErrors[0]) {
    return flattened.formErrors[0];
  }

  return 'auth.zod.genericInvalid';
}
