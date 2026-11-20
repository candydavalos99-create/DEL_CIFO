import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: el navegador solo deja que una web hable con otro "origen"
  // (otra combinación de dominio y puerto) si ese servidor lo autoriza.
  // En local autorizamos al frontend del puerto 8080. En Render, la variable
  // de entorno CORS_ORIGIN indica la dirección del frontend publicado
  // (se pueden poner varias separadas por comas).
  const origenes = (process.env.CORS_ORIGIN ?? 'http://localhost:8080')
    .split(',')
    .map((origen) => origen.trim().replace(/\/$/, ''))
    .filter(Boolean);
  app.enableCors({ origin: origenes });

  // Validación automática con los DTOs:
  // - whitelist: descarta los campos que no están en el DTO
  // - transform: convierte el JSON en un objeto DTO (y aplica el recorte de espacios)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // El backend escucha en el puerto 3000 en local; en Render, en el que indique la variable PORT
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
