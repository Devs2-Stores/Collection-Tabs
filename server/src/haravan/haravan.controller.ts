import { Controller, Get, Post, Query, Body, Res, Req } from '@nestjs/common';
import { HaravanService } from './haravan.service';
import { Response } from 'express';

@Controller('/oauth/install')
export class HaravanController {
  constructor(private readonly haravanService: HaravanService) {}

  @Post('/login')
  async login() {
    try {
      return {
        success: true,
        data: await this.haravanService.handleLogin(),
        status: 200,
        errorCode: null, 
        errorMessage: null,
      };
    } catch (error) {
      console.log('Error in Step Login', error);
    }
  }

  @Post('/grandservice')
  async install(@Req() req: any, @Res() res: Response) {
    await this.haravanService.handleInstall(req, res);
  }
}
