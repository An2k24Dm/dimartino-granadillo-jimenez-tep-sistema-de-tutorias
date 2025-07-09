import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from '../../log/log.service'; // Ajusta la ruta a tu LogService

@Injectable()
export class DatabaseLoggingInterceptor implements NestInterceptor {
  // Inyectamos el LogService para poder usarlo
    constructor(private readonly logService: LogService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;

        // El payload del usuario se adjunta a la request por el AuthGuard
        const userPayload = request.user;

        return next.handle().pipe(
        tap(async () => {
            // Solo registra si hay un usuario autenticado
            if (userPayload && userPayload.userId) {
            const accion = `Petición a ${method} ${url}`;

            await this.logService.createLog({
                usuarioId: userPayload.userId,
                accion: accion,
                ruta: url,
                metodo: method,
            });
            }
        }),
        );
    }
}