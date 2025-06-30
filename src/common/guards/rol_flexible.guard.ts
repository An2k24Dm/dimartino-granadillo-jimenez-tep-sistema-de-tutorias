import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class RolFlexibleGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('allowedRoles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      throw new ForbiddenException('Este endpoint requiere especificar roles permitidos (uso de @AllowedRoles)');
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException('No se proporcionó token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Formato de token inválido');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      if (!requiredRoles.includes(payload.rol)) {
        throw new ForbiddenException(`Acceso solo permitido para: ${requiredRoles.join(', ')}`);
      }

      request.user = { userId: payload.sub, rol: payload.rol }; // Guardar el usuario para usar después
      return true;
    } catch (error) {
      throw new ForbiddenException('Token inválido o expirado');
    }
  }
}
