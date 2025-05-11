import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ShopAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const shop = request.cookies['shop'];
    const token = request.cookies['access_token'];

    return { shop, token };
  }
);
