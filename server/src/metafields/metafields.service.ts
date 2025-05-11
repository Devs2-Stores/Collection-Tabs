import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from 'src/common/token/token.service';
import HaravanAPI from 'src/utils/haravan.util';

@Injectable()
export class MetafieldsService {
  constructor(private readonly tokenService: TokenService) { }

  async getMetafields(shop: string, token: string, type: string, id: string) {
    if (!shop || !token) throw new UnauthorizedException();
    if (!type || !id) throw new BadRequestException("Type and ID are required");
    const decryptToken = await this.tokenService.decryptToken(token);
    return await HaravanAPI.getMetafields(shop, decryptToken, type, id);
  }

  async createMetafields(shop: string, token: string, query: any) {
    if (!shop || !token) throw new UnauthorizedException();
    return "Metafields created";
  }
  async updateMetafields(shop: string, token: string, values: Object) {
    if (!shop || !token) throw new UnauthorizedException();
    const decryptToken = await this.tokenService.decryptToken(token);
    return await HaravanAPI.updateMetafields(shop, decryptToken, values);
  }
  async deleteMetafields(shop: string, token: string, query: any) {
    if (!shop || !token) throw new UnauthorizedException();
    return "Metafields deleted";
  }
}
