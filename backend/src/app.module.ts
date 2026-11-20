import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductosModule } from './productos/productos.module.js';

@Module({
  imports: [
    // Conexión con MongoDB: servidor local (puerto 27017), base de datos "catalogo"
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/catalogo'),
    ProductosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
