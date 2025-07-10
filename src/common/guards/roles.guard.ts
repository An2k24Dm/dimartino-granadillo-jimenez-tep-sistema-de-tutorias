import * as dotenv from 'dotenv';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

dotenv.config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('No se proporcionó ningún token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Formato de token inválido');
    }

    const decoded = this.jwtService.decode(token);
    if (!decoded) {
      throw new ForbiddenException('Token inválido o corrupto');
    }

    if (decoded['rol'] !== 'coordinador') {
      throw new ForbiddenException('Acceso solo permitido para coordinadores');
    }

    try {
      this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      return true;
    } catch (error) {
      throw new ForbiddenException('Token inválido o expirado');
    }
  }
}
