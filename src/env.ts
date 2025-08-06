// Завантажуємо змінні середовища з .env файлу
import { config } from 'dotenv';
config();

// Експортуємо змінні середовища
export const env = {
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_SECURE: process.env.SMTP_SECURE || 'false',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_TO: process.env.EMAIL_TO || '',
}; 