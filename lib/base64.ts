/** UTF-8 safe Base64 encode/decode helpers for the browser. */

export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function decodeBase64(input: string): string {
  const cleaned = input.trim();
  // Accept base64url as well by normalising the alphabet.
  const normalised = cleaned.replace(/-/g, "+").replace(/_/g, "/");

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalised)) {
    throw new Error("Input contains characters that are not valid Base64.");
  }

  let binary: string;
  try {
    binary = atob(normalised);
  } catch {
    throw new Error("Not a valid Base64 string.");
  }

  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}
