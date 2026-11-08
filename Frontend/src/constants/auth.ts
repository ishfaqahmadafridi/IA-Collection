import type { Credentials, Registration } from '../types/api';
export const EMPTY_CREDENTIALS: Credentials = { username: '', password: '' };
export const EMPTY_REGISTRATION: Registration = { ...EMPTY_CREDENTIALS, email: '' };
