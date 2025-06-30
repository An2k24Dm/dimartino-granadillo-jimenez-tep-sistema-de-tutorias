import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//Obtengo el payload del token
export const User = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});