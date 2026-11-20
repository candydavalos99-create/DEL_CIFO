import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';
import { Producto, ProductoSchema } from './schemas/producto.schema.js';

// Módulo: la "sección de productos" de la tienda.
// forFeature registra el esquema Producto para poder usar su modelo en el servicio.
@Module({
  imports: [MongooseModule.forFeature([{ name: Producto.name, schema: ProductoSchema }])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
