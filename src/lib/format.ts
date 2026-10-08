import { soloDigitos } from '@/lib/validations';

export function formatSoles(amount: number): string {
  return `S/ ${amount.toFixed(2)}`;
}

export function whatsappUrl(raw: string): string {
  const digits = soloDigitos(raw);
  return digits ? `https://wa.me/${digits}` : '#';
}
