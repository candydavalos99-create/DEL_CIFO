import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: el navegador solo deja que una web hable con otro "origen"
  // (otra combinación de dominio y puerto) si ese servidor lo autoriza.
  // Autorizamos únicamente a nuestro frontend, servido en el puerto 8080.
  app.enableCors({ origin: 'http://localhost:8080' });

  // Validación automática con los DTOs:
  // - whitelist: descarta los campos que no están en el DTO
  // - transform: convierte el JSON en un objeto DTO (y aplica el recorte de espacios)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // El backend escucha en el puerto 3000
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
