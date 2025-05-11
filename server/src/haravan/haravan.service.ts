import { Injectable } from '@nestjs/common';
import { custom } from 'openid-client';
import { ConfigService } from '@nestjs/config';
import { createHaravanClient } from '../utils/haravan.util';
import { HaravanRepository } from './haravan.repository';
import { TokenService } from 'src/common/token/token.service';
import { Response } from 'express';

@Injectable()
export class HaravanService {
  constructor(
    private readonly config: ConfigService,
    private readonly tokenService: TokenService,
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
      const encryptedToken = await this.tokenService.encryptToken(access_token);

      const refresh_token = tokenSet.refresh_token;
      const expires_in = tokenSet.expires_at;

      // Truyền Shop vào cookie khi lần đầu cài App
      const shop = tokenSet.claims();
      res.cookie('shop', shop, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 400 * 24 * 60 * 60 * 1000
      });

      // Truyền Orgid vào cookie khi lần đầu cài App
      const orgId = String(tokenSet.claims().orgid) || 'defaultOrg';
      res.cookie('orgid', orgId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 400 * 24 * 60 * 60 * 1000
      });

      const tokenData = {
        encryptedToken,
        refresh_token,
        expires_at: Date.now() + expires_in * 1000, // timestamp
      };
      const ttl = Math.min(tokenSet.expires_in, 3600);
      await this.tokenService.storeToken(orgId, tokenData, ttl, res);
      return res.redirect(`/`);
    } catch (error) {
      console.error('Error during token callback:', error);
      res.status(500).send({ error: 'Failed to store token' });
    }
  }

  async refreshToken(orgId, refresh_token, res): Promise<string> {
    try {
      if (!refresh_token) {
        throw new Error(`No refresh_token found for orgId: ${orgId}`);
      }

      const client = await createHaravanClient(this.config);
      const tokenSet = await client.refresh(refresh_token);

      const newAccessToken = tokenSet.access_token;
      const encryptedNewAccessToken = this.haravanRepository.encryptToken(newAccessToken);

      const newTokenData = {
        encryptedToken: encryptedNewAccessToken,
        refresh_token: tokenSet.refresh_token || refresh_token,
        expires_at: Date.now() + tokenSet.expires_at * 1000,
      };
      const ttl = Math.min(tokenSet.expires_in, 3600);
      await this.tokenService.storeToken(orgId, newTokenData, ttl, res);

      console.log(`Token refreshed successfully for orgId: ${orgId}`);
      return newAccessToken;
    } catch (error) {
      console.error(`Error refreshing token for orgId: ${orgId}`, error);
      throw new Error('Failed to refresh token');
    }
  }
} 
