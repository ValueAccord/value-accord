import { createHash, generateKeyPairSync, sign, verify } from "node:crypto";

export function canonicalize(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function createSigningIdentity(id = "accord-sandbox") {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    id,
    privateKey,
    publicKey,
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" })
  };
}

export function digest(payload) {
  return createHash("sha256").update(canonicalize(payload)).digest("hex");
}

export function signPayload(payload, privateKey) {
  return sign(null, Buffer.from(canonicalize(payload)), privateKey).toString("base64url");
}

export function verifyPayload(payload, signature, publicKey) {
  return verify(null, Buffer.from(canonicalize(payload)), publicKey, Buffer.from(signature, "base64url"));
}
