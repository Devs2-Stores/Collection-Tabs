import { Controller, Get, Post, Query, Body, Res, Req } from '@nestjs/common';
import { HaravanService } from './haravan.service';
import { Response } from 'express';

@Controller('server/install')
export class HaravanController {
  constructor(private readonly haravanService: HaravanService) {}

  @Post('login')
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

  @Post('grandservice')
  async install(@Req() req: any, @Res() res: Response) {
    console.log(req);
    try {
      return { 
        success: true, 
        data: await this.haravanService.handleInstall(req, res),
        status: 200,
        errorCode: null,
        errorMessage: null,
      };
    } catch (error) {
      return { 
        success: false,
        data: null,
        status: 500,
        errorCode: 'INSTALL_ERROR',
        errorMessage: 'An error occurred during installation.',
      }
    }
  }

  @Get('token')
  async getToken(@Query('orgid') orgid: string, @Res() res: Response) {
    return await this.haravanService.getTokenFromRedis(orgid);
  }
}
