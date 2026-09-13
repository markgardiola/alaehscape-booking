/**
 * Mirrors the backend's PH phone normalization (utils/otp.js) so the
 * form can validate/format before ever hitting the server.
 */
export function normalizePhilippinePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");

  if (digits.startsWith("63") && digits.length === 12)
    return "0" + digits.slice(2);
  if (digits.startsWith("09") && digits.length === 11) return digits;
  if (digits.startsWith("9") && digits.length === 10) return "0" + digits;
  return null;
}

export function isValidPhilippinePhone(input) {
  return normalizePhilippinePhone(input) !== null;
}
