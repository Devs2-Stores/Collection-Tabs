import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HaravanService } from 'src/haravan/haravan.service';
import { TokenService } from 'src/common/token/token.service';
import { Response } from 'express';

@Injectable()
export class ShopAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService, private readonly haravanService: HaravanService) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const shop = req.cookies['shop'];
    const orgid = req.cookies['orgid'];

    if (!shop) throw new UnauthorizedException('Missing shop');
    res.cookie('shop', shop, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: 400 * 24 * 60 * 60 * 1000, // Đặt lại thời gian sống
    });

    if (!orgid) throw new UnauthorizedException('Missing orgid');
    res.cookie('orgid', orgid, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 400 * 24 * 60 * 60 * 1000
    });

    const token = req.cookies['access_token'];
    if (!token) throw new UnauthorizedException('Missing access_token');
    const { expires_at, refresh_token } = await this.tokenService.retrieveToken(orgid);
    const isExpired = this.tokenService.isTokenExpired(expires_at, 1);
    if (isExpired){
      await this.haravanService.refreshToken(orgid, refresh_token, res);
    }
    return true;
  }
}
