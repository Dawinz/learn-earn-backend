"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDeviceIdentity = generateDeviceIdentity;
exports.verifySignature = verifySignature;
exports.createSignature = createSignature;
exports.generateNonce = generateNonce;
exports.hashMobileMoneyNumber = hashMobileMoneyNumber;
exports.verifyMobileMoneyHash = verifyMobileMoneyHash;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate Ed25519 keypair and derive device ID
 */
function generateDeviceIdentity(appPepper) {
    const keyPair = crypto_1.default.generateKeyPairSync('ed25519');
    const publicKey = keyPair.publicKey.export({ type: 'spki', format: 'pem' });
    const privateKey = keyPair.privateKey.export({ type: 'pkcs8', format: 'pem' });
    // Derive device ID using app pepper + public key
    const deviceId = crypto_1.default
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
function verifySignature(message, signature, publicKeyPem) {
    try {
        const publicKey = crypto_1.default.createPublicKey(publicKeyPem);
        const verifier = crypto_1.default.createVerify('ed25519');
        verifier.update(message);
        return verifier.verify(publicKey, signature, 'base64');
    }
    catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}
/**
 * Create signature for a message using private key
 */
function createSignature(message, privateKeyPem) {
    const privateKey = crypto_1.default.createPrivateKey(privateKeyPem);
    const signer = crypto_1.default.createSign('ed25519');
    signer.update(message);
    return signer.sign(privateKey, 'base64');
}
/**
 * Generate a secure nonce for anti-replay protection
 */
function generateNonce() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
/**
 * Hash mobile money number for privacy
 */
function hashMobileMoneyNumber(number, appPepper) {
    return crypto_1.default
        .createHash('sha256')
        .update(appPepper + number)
        .digest('hex');
}
/**
 * Verify mobile money number hash
 */
function verifyMobileMoneyHash(number, hash, appPepper) {
    return hashMobileMoneyNumber(number, appPepper) === hash;
}
//# sourceMappingURL=crypto.js.map