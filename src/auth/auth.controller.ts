import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: { correo: string; contraseña: string }) {
    return this.authService.login(dto.correo, dto.contraseña); // Genera el token para futuras consultas a la API. Dentro tiene el id y el rol del usuario
  }
}
