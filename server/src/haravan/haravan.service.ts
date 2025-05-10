import { Injectable } from '@nestjs/common';
import { Issuer, custom } from 'openid-client';
import { ConfigService } from '@nestjs/config';
import { encrypt, decrypt } from '../utils/crypto.util';
import { setToken, getToken } from '../utils/redis.util';
import { createHaravanClient } from '../utils/haravan.util';
import { HaravanRepository } from './haravan.repository';

@Injectable()
export class HaravanService {
  constructor(
    private readonly config: ConfigService,
    private readonly haravanRepository: HaravanRepository,
  ) {
    this.config = config;
  }

  async handleLogin() {
    try {
      const client = await createHaravanClient(this.config);
      const url = client.authorizationUrl({
        scope: this.config.get('HRV_SCOPE'),
        response_mode: this.config.get('HRV_RESPONSE_MODE'),
        nonce: this.config.get('HRV_NONCE'),
      });
      return url;
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to generate login URL');
    }
  }

  async handleInstall(req: any, res: any) {
    const client = await createHaravanClient(this.config);
    // assumes req.body is populated from your web framework's body parser
    const params = client.callbackParams(req);
    params.client_id = this.config.get('HRV_CLIENT_ID');
    params.client_secret = this.config.get('HRV_CLIENT_SECRET');
    params.grant_type = 'authorization_code';

    client[custom.clock_tolerance] = 10;
    const nonce = this.config.get('HRV_NONCE');

    try {
      const tokenSet = await client.callback(
        this.config.get('HRV_CALLBACK_URL'),
        params,
        { nonce },
      );

      const access_token = tokenSet.access_token;
      const encryptedToken = encrypt(access_token);

      const refresh_token = tokenSet.refresh_token;
      const expires_in = tokenSet.expires_at;
      const orgId = String(tokenSet.claims().orgid) || 'defaultOrg';

      const tokenData = {
        encryptedToken,
        refresh_token,
        expires_at: Date.now() + expires_in * 1000, // timestamp
      };
      console.log(tokenData);
      const ttl = Math.min(tokenSet.expires_in, 3600);
      await setToken(orgId, JSON.stringify(tokenData), ttl);
      console.log(await getToken(orgId));
      console.log('Token stored successfully in Redis');
      res.cookie('access_token', encryptedToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000, // 1 tiếng
      });
      res.cookie('orgid', orgId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return res.redirect(`/?orgid=${orgId}`);
    } catch (error) {
      console.error('Error during token callback:', error);
      res.status(500).send({ error: 'Failed to store token' });
    }
  }

  async getTokenFromRedis(orgId: string): Promise<string> {
    const tokenData = await this.haravanRepository.retrieveToken(orgId);
    const { encryptedToken, expires_at } = tokenData;

    // Kiểm tra nếu token đã hết hạn
    if (this.haravanRepository.isTokenExpired(expires_at)) {
      console.log(`Token expired for orgId: ${orgId}, refreshing token...`);
      return await this.refreshToken(orgId);
    }

    // Giải mã token
    const decryptedToken = this.haravanRepository.decryptToken(encryptedToken);
    console.log(decryptedToken);
    return decryptedToken;
  }

  async refreshToken(orgId: string): Promise<string> {
    try {
      const tokenData = await this.haravanRepository.retrieveToken(orgId);
      const { refresh_token } = tokenData;

      if (!refresh_token) {
        throw new Error(`No refresh_token found for orgId: ${orgId}`);
      }

      const client = await createHaravanClient(this.config);
      const tokenSet = await client.refresh(refresh_token);

      const newAccessToken = tokenSet.access_token;
      const encryptedNewAccessToken =
        this.haravanRepository.encryptToken(newAccessToken);

      const newTokenData = {
        encryptedToken: encryptedNewAccessToken,
        refresh_token: tokenSet.refresh_token || refresh_token,
        expires_at: Date.now() + tokenSet.expires_in * 1000,
      }; 

      await this.haravanRepository.storeToken(orgId, newTokenData, 3600);

      console.log(`Token refreshed successfully for orgId: ${orgId}`);
      return newAccessToken;
    } catch (error) {
      console.error(`Error refreshing token for orgId: ${orgId}`, error);
      throw new Error('Failed to refresh token');
    }
  }
} 
