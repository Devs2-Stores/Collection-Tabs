import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { decrypt, encrypt } from 'src/utils/crypto.util';
import { getToken, setToken } from 'src/utils/redis.util';

@Injectable()
export class TokenService {
  encryptToken(token: string): string {
    return encrypt(token);
  }


  decryptToken(encryptedToken: string): string {
    return decrypt(encryptedToken);
  }

  async storeToken(orgId: string, tokenData: any, ttl: number, res: Response): Promise<void> {
    await setToken(orgId, JSON.stringify(tokenData), ttl);
    res.cookie('access_token', tokenData.encryptedToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: tokenData.expires_at
    });

  }

  async retrieveToken(orgId: string): Promise<any> {
    const tokenDataString = await getToken(orgId);
    if (!tokenDataString) {
      throw new Error(`Token not found for orgId: ${orgId}`);
    }
    return JSON.parse(tokenDataString);
  }

  isTokenExpired(expiresAt: number, bufferMinutes: number = 50): boolean {
    const bufferMs = bufferMinutes * 60 * 1000;
    return Date.now() > expiresAt - bufferMs;
  }
}
