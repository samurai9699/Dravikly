import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

export const resend = new Resend(RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@dravikly.com';
export const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || 'admin@dravikly.com';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
