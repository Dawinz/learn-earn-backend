import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export interface DeviceIdentity {
  deviceId: string;
  publicKey: string;
  privateKey: string;
}

/**
 * Generate Ed25519 keypair and derive device ID
 */
export function generateDeviceIdentity(appPepper: string): DeviceIdentity {
  const keyPair = crypto.generateKeyPairSync('ed25519');
  const publicKey = keyPair.publicKey.export({ type: 'spki', format: 'pem' });
  const privateKey = keyPair.privateKey.export({ type: 'pkcs8', format: 'pem' });
  
  // Derive device ID using app pepper + public key
  const deviceId = crypto
    .createHash('sha256')
    .update(appPepper + publicKey)
    .digest('hex');
  
  return {
    deviceId,
    publicKey: publicKey.toString(),
    privateKey: privateKey.toString()
  };
}

/**
 * Verify signature using Ed25519 public key
 */
export function verifySignature(
  message: string,
  signature: string,
  publicKeyPem: string
): boolean {
  try {
    const publicKey = crypto.createPublicKey(publicKeyPem);
    const verifier = crypto.createVerify('ed25519');
    verifier.update(message);
    return verifier.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Create signature for a message using private key
 */
export function createSignature(
  message: string,
  privateKeyPem: string
): string {
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = crypto.createSign('ed25519');
  signer.update(message);
  return signer.sign(privateKey, 'base64');
}

/**
 * Generate a secure nonce for anti-replay protection
 */
export function generateNonce(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash mobile money number for privacy
 */
export function hashMobileMoneyNumber(number: string, appPepper: string): string {
  return crypto
    .createHash('sha256')
    .update(appPepper + number)
    .digest('hex');
}

/**
 * Verify mobile money number hash
 */
export function verifyMobileMoneyHash(
  number: string,
  hash: string,
  appPepper: string
): boolean {
  return hashMobileMoneyNumber(number, appPepper) === hash;
}
