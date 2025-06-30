export function normalizePhoneNumber(raw) {
  let num = raw.trim();

  if (num.startsWith('+234') || num.startsWith('0')) {
    return num;
  }

  if (num.startsWith('234')) {
    return '+' + num;
  }

  if (/^\d{10}$/.test(num)) {
    return '0' + num;
  }
  return num;
}
