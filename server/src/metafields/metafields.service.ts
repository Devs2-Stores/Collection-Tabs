import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class MetafieldsService {
  async getMetafields(shop: string, token: string, type: string, id: string) {
    if (!shop || !token) throw new UnauthorizedException();
    if (!type || !id) throw new BadRequestException("Type and ID are required"); 

    return {
      success: true,
      data: "Metafields data",
      status: 200,
      errorCode: null,
      errorMessage: null,
    };
  }

  async createMetafields(shop: string, token: string, query: any) {
    if (!shop || !token) throw new UnauthorizedException();
    return "Metafields created";
  }
  async updateMetafields(shop: string, token: string, query: any) {
    if (!shop || !token) throw new UnauthorizedException();
    return "Metafields updated";
  }
  async deleteMetafields(shop: string, token: string, query: any) {
    if (!shop || !token) throw new UnauthorizedException();
    return "Metafields deleted";
  }
}
