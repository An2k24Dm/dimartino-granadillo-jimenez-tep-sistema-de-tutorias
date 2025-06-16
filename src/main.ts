import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port);
  console.log(`App corriendo en http://localhost:${port}`);
}
bootstrap();