import * as crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(
  'bb678916e2d5aef4e1e42ef3a78cc6b761ec0d47c605f5bcc1b567a62c3dcb1e',
  'hex',
); // Khóa 256-bit (32 bytes)
const IV_LENGTH = 16; // Chiều dài IV (Initialization Vector)

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH); // Tạo IV ngẫu nhiên
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Kết hợp IV và dữ liệu mã hóa
};

export const decrypt = (encryptedText: string): string => {
  try {
    const [iv, encrypted] = encryptedText.split(':'); // Tách IV và dữ liệu mã hóa
    if (!iv || !encrypted) {
      throw new Error('Invalid encrypted text format');
    }
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      ENCRYPTION_KEY,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error.message);
    throw new Error('Decryption failed');
  }
};
