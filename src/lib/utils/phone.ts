/**
 * Normaliza números de teléfono de Venezuela al formato internacional estándar 584XXXXXXXXX (12 dígitos).
 * Limpia espacios, guiones, símbolos (+) y maneja prefijos como 0414, 414, +58, 580414, etc.
 *
 * @param phone Teléfono en formato crudo ingresado por el usuario o cliente
 * @returns Teléfono normalizado en formato internacional estándar (ej. 584141234567)
 */
export function normalizeVenezuelaPhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  // 1. Eliminar todos los caracteres no numéricos
  let digits = phone.replace(/\D/g, '');

  if (!digits) return '';

  // 2. Manejar prefijos internacionales con 0 redundante (ej. +58 0414... -> 580414...)
  if (digits.startsWith('580') && digits.length === 13) {
    digits = '58' + digits.slice(3);
  }

  // 3. Manejar formato nacional estándar con 0 inicial (ej. 04141234567 -> 584141234567)
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '58' + digits.slice(1);
  }

  // 4. Manejar formato sin código de país ni 0 inicial (ej. 4141234567 -> 584141234567)
  if (digits.length === 10 && (digits.startsWith('4') || digits.startsWith('2'))) {
    digits = '58' + digits;
  }

  // 5. Si ya tiene 12 dígitos y empieza por 58 (ej. 584141234567), se mantiene
  return digits;
}
