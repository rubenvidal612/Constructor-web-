import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16;

/**
 * Derives a 32-byte cryptographic key from a master secret and salt
 * using PBKDF2 with SHA-256 and 100,000 iterations.
 */
export function deriveKey(masterSecret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterSecret, salt, 100000, 32, 'sha256');
}

export interface EncryptedPayload {
  ivHex: string;
  authTagHex: string;
  saltHex: string;
  ciphertextHex: string;
  algorithm: string;
}

/**
 * Encrypts a sensitive user token (e.g. GitHub PAT or Vercel token)
 * using AES-256-GCM authenticated encryption.
 */
export function encryptSecret(plainText: string, masterSecret?: string): EncryptedPayload {
  const secret = masterSecret || process.env.ENCRYPTION_SECRET_KEY || 'default-studio-key-32-chars-hex-length!';
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(secret, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let ciphertext = cipher.update(plainText, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    ivHex: iv.toString('hex'),
    authTagHex: authTag.toString('hex'),
    saltHex: salt.toString('hex'),
    ciphertextHex: ciphertext,
    algorithm: ALGORITHM,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload and verifies the MAC authentication tag.
 * Throws an error if ciphertext or tag was tampered with.
 */
export function decryptSecret(payload: EncryptedPayload, masterSecret?: string): string {
  const secret = masterSecret || process.env.ENCRYPTION_SECRET_KEY || 'default-studio-key-32-chars-hex-length!';
  const salt = Buffer.from(payload.saltHex, 'hex');
  const key = deriveKey(secret, salt);
  const iv = Buffer.from(payload.ivHex, 'hex');
  const authTag = Buffer.from(payload.authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(payload.ciphertextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
