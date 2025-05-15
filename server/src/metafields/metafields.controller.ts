import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MetafieldsService } from './metafields.service';
import { ShopAuth } from '../common/decorators/shop-auth.decorator';
import { ShopAuthGuard } from '../common/guards/shop-auth.guard';

@Controller('metafields')
export class MetafieldsController {
  constructor(private readonly metafieldsService: MetafieldsService) { }

  @UseGuards(ShopAuthGuard)
  @Get()
  async getMetafields(@ShopAuth() auth, @Query() query) {
    const { shop, token } = auth;
    const { type, id } = query;
    return await this.metafieldsService.getMetafields(shop, token, type, id);
  }

  @UseGuards(ShopAuthGuard)
  @Post()
  async createMetafields(@ShopAuth() auth, @Body() body) {
    const { shop, token } = auth;
    return await this.metafieldsService.createMetafields(shop, token, body);
  }

  @UseGuards(ShopAuthGuard)
  @Put()
  async updateMetafields(@ShopAuth() auth, @Body() body) {
    const { shop, token } = auth;
    return await this.metafieldsService.updateMetafields(shop, token, body);
  }

  @UseGuards(ShopAuthGuard)
  @Delete()
  async deleteMetafields(@ShopAuth() auth, @Query() query) {
    const { shop, token } = auth;
    return await this.metafieldsService.deleteMetafields(shop, token, query);
  }

}
