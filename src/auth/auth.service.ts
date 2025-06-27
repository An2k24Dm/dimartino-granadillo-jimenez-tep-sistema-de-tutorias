import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(correo: string, contraseña: string) {
      const usuario = await this.usuarioService.buscarPorCorreo(correo);
      if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!contraseñaValida) throw new UnauthorizedException('Contraseña incorrecta');

      const rol = await this.usuarioService.verificarRol(usuario.id);

      const payload = { sub: usuario.id, rol};
      return {
          // Internamente, JwtService usa la clave secreta (secret) para firmar el payload.
          access_token: this.jwtService.sign(payload), // firmo el payload con la clave secreta para generar un token para cada usuario
      };
  }
}
