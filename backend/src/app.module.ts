import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

@Module({
  imports: [
    // Conexión con MongoDB. En local: servidor del puerto 27017, base de datos "catalogo".
    // En Render: la variable de entorno MONGODB_URI con la dirección de MongoDB Atlas
    // (es secreta: lleva usuario y contraseña, nunca se escribe en el código).
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/catalogo'),
    ProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
