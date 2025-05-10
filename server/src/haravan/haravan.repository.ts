import { Injectable } from '@nestjs/common';
import { encrypt, decrypt } from '../utils/crypto.util';
import { setToken, getToken } from '../utils/redis.util';

@Injectable()
export class HaravanRepository {
  encryptToken(token: string): string {
    return encrypt(token);
  }


  decryptToken(encryptedToken: string): string {
    return decrypt(encryptedToken);
  }

  async storeToken(orgId: string, tokenData: any, ttl: number): Promise<void> {
    await setToken(orgId, JSON.stringify(tokenData), ttl);
  }

  async retrieveToken(orgId: string): Promise<any> {
    const tokenDataString = await getToken(orgId);
    if (!tokenDataString) {
      throw new Error(`Token not found for orgId: ${orgId}`);
    }
    return JSON.parse(tokenDataString);
  }

  isTokenExpired(expiresAt: number): boolean {
    return Date.now() > expiresAt;
  }
}
