import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const isUser = async (): Promise<{
  validation: ActionValidation;
  user: Member | null;
}> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      user: null,
    };
  }

  return { validation: { ok: true }, user };
};
