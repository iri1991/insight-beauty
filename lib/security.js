import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordRecord(password) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 64).toString("hex");

  return {
    passwordSalt: salt,
    passwordHash
  };
}

export function verifyPassword(password, passwordSalt, passwordHash) {
  if (!password || !passwordSalt || !passwordHash) {
    return false;
  }

  const candidateHash = scryptSync(password, passwordSalt, 64);
  const storedHash = Buffer.from(passwordHash, "hex");

  if (candidateHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(candidateHash, storedHash);
}
