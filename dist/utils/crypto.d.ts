export interface DeviceIdentity {
    deviceId: string;
    publicKey: string;
    privateKey: string;
}
/**
 * Generate Ed25519 keypair and derive device ID
 */
export declare function generateDeviceIdentity(appPepper: string): DeviceIdentity;
/**
 * Verify signature using Ed25519 public key
 */
export declare function verifySignature(message: string, signature: string, publicKeyPem: string): boolean;
/**
 * Create signature for a message using private key
 */
export declare function createSignature(message: string, privateKeyPem: string): string;
/**
 * Generate a secure nonce for anti-replay protection
 */
export declare function generateNonce(): string;
/**
 * Hash mobile money number for privacy
 */
export declare function hashMobileMoneyNumber(number: string, appPepper: string): string;
/**
 * Verify mobile money number hash
 */
export declare function verifyMobileMoneyHash(number: string, hash: string, appPepper: string): boolean;
//# sourceMappingURL=crypto.d.ts.map