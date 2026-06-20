/** Pure, dependency-free JWT decoding helpers. No verification — decode only. */

export interface JwtClaims {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface JwtHeader {
  alg?: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtClaims;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

/** Decode a base64url-encoded string to UTF-8 text. */
export function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";
  else if (pad === 1) throw new Error("Invalid base64url string");

  if (typeof atob !== "function") {
    throw new Error("Base64 decoding is not available in this environment");
  }

  const binary = atob(base64);
  // Reconstruct UTF-8 from the binary string so multi-byte chars survive.
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

/** Decode a JWT into its header, payload and signature. Throws on malformed input. */
export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  if (!trimmed) throw new Error("Token is empty");

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error(
      `A JWT must have 3 parts separated by dots (got ${parts.length}).`
    );
  }

  const [rawHeader, rawPayload, rawSignature] = parts;

  let header: JwtHeader;
  let payload: JwtClaims;

  try {
    header = JSON.parse(base64UrlDecode(rawHeader));
  } catch {
    throw new Error("Could not decode the header — it is not valid base64/JSON.");
  }

  try {
    payload = JSON.parse(base64UrlDecode(rawPayload));
  } catch {
    throw new Error(
      "Could not decode the payload — it is not valid base64/JSON."
    );
  }

  return {
    header,
    payload,
    signature: rawSignature,
    raw: { header: rawHeader, payload: rawPayload, signature: rawSignature },
  };
}

export type ExpiryStatus = "valid" | "expired" | "not-yet-valid" | "none";

export interface ExpiryInfo {
  status: ExpiryStatus;
  message: string;
}

function formatRelative(seconds: number): string {
  const abs = Math.abs(seconds);
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [Infinity, "day"],
  ];
  let value = abs;
  let unit = "second";
  for (let i = 0; i < units.length; i++) {
    const [divisor, name] = units[i];
    if (value < divisor) {
      unit = name;
      break;
    }
    value = value / divisor;
    unit = units[i + 1]?.[1] ?? name;
  }
  const rounded = Math.floor(value);
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"}`;
}

/** Evaluate exp / nbf against the current time. */
export function getExpiryInfo(payload: JwtClaims, nowMs = Date.now()): ExpiryInfo {
  const nowSec = Math.floor(nowMs / 1000);

  if (typeof payload.nbf === "number" && nowSec < payload.nbf) {
    return {
      status: "not-yet-valid",
      message: `Not valid yet — becomes active in ${formatRelative(
        payload.nbf - nowSec
      )}.`,
    };
  }

  if (typeof payload.exp !== "number") {
    return { status: "none", message: "No expiry (exp) claim present." };
  }

  if (nowSec >= payload.exp) {
    return {
      status: "expired",
      message: `Expired ${formatRelative(nowSec - payload.exp)} ago.`,
    };
  }

  return {
    status: "valid",
    message: `Valid — expires in ${formatRelative(payload.exp - nowSec)}.`,
  };
}

/** Convert a NumericDate (seconds since epoch) to a readable UTC string. */
export function formatTimestamp(value: unknown): string | null {
  if (typeof value !== "number") return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toUTCString();
}
