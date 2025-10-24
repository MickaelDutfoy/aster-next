import { handlers } from '@/auth';

export const runtime = 'nodejs'; // important avec bcrypt natif
export const { GET, POST } = handlers;
