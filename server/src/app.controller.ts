import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { decrypt } from './utils/crypto.util';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("collections")
  async getCollections(@Req() req) {
    const token = req.cookies['access_token'];
    const shop = req.cookies['shop'];
    const decryptToken = decrypt(token);
    console.log(req);
    const data = {
      title: "Tab5",
      content: "Nội dung Tab 5"
    };
    const collects = await axios.post("https://apis.haravan.com/com/metafields.json?metafield[owner_id]=1004410101", {
      "metafield": {
        "namespace": "f1genztabs",
        "key": "tabs",
        "value": JSON.stringify(data),
        "value_type": "json"
      }
    }, {
      headers: {
        Authorization: `Bearer ${decryptToken}`,
      },
    });
    console.log(collects.data);
    return "";
  }
}
