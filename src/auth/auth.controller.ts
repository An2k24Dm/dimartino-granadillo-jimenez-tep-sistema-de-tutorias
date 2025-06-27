import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(
    @Body(new ValidationPipe({ transform: true })) dto: LoginDto //Valido con el dto que el correo y la contraseña tengan un formato correcto
  ) {
    return this.authService.login(dto.correo, dto.contraseña); // Genera el token para futuras consultas a la API. Dentro tiene el id y el rol del usuario
  }
}
