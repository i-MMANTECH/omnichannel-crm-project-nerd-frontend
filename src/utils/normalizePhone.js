export function normalizePhoneNumber(raw) {
  let num = raw.trim();

  if (num.startsWith('+234')) {
    // Replace +234 with 0
    return '0' + num.slice(4);
  }

  if (num.startsWith('234')) {
    // Replace 234 with 0
    return '0' + num.slice(3);
  }

  if (num.startsWith('0')) {
    return num;
  }

  if (/^\d{10}$/.test(num)) {
    return '0' + num;
  }

  return num;
}
