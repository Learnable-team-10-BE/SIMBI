import { ethers } from 'ethers';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { EncryptedData } from '../interfaces/auth.interface';

const algorithm = 'aes-256-cbc';
const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error('ENCRYPTION_KEY not set');
}

// Convert the key to a Buffer of exactly 32 bytes
const keyBuffer = Buffer.alloc(32);
const keyBytes = Buffer.from(encryptionKey);
keyBytes.copy(keyBuffer);

export const generateWallet = (): { address: string; privateKey: string } => {
  try {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    console.error('Error generating wallet:', error);
    throw new Error('Failed to generate wallet');
  }
};

export const encryptPrivateKey = (privateKey: string): EncryptedData => {
  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
    };
  } catch (error) {
    console.error('Error encrypting private key:', error);
    throw new Error('Failed to encrypt private key');
  }
};

export const decryptPrivateKey = (encrypted: EncryptedData): string => {
  try {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const decipher = createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Error decrypting private key:', error);
    throw new Error('Failed to decrypt private key');
  }
};