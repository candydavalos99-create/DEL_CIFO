import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';
import type { Model } from 'mongoose';
import { Producto } from './schemas/producto.schema.js';
import type { ProductoDocument } from './schemas/producto.schema.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

// Productos de ejemplo: solo se insertan si la colección está vacía (la primera vez)
const EJEMPLOS = [
  { nombre: 'MacBook Air 13"', marca: 'Apple', categoria: 'portatil', precio: 1199, stock: 5, descripcion: 'Portátil ligero con chip M3.' },
  { nombre: 'MX Master 3S', marca: 'Logitech', categoria: 'periferico', precio: 109.99, stock: 12, descripcion: 'Ratón ergonómico inalámbrico.' },
  { nombre: 'ThinkVision P27h', marca: 'Lenovo', categoria: 'monitor', precio: 349, stock: 0, descripcion: '' },
];

// Quita los campos "undefined" (los que no se enviaron en la petición)
const sinVacios = (dto: object) => Object.fromEntries(Object.entries(dto).filter(([, valor]) => valor !== undefined));

// Servicio: el "encargado del almacén". Fase 3: ya no guarda un array;
// le pide y le entrega los datos a MongoDB a través del modelo de Mongoose.
@Injectable()
export class ProductosService implements OnModuleInit {
  // El "modelo" es el acceso a la colección productos de la BD catalogo
  constructor(@InjectModel(Producto.name) private readonly productoModel: Model<Producto>) {}

  // Al arrancar: si la colección está vacía, la rellena con los ejemplos
  async onModuleInit() {
    if ((await this.productoModel.countDocuments()) === 0) {
      await this.productoModel.insertMany(EJEMPLOS);
    }
  }

  // ---- Listar todos (en orden de creación) ----
  findAll(): Promise<ProductoDocument[]> {
    return this.productoModel.find().sort({ createdAt: 1 }).exec();
  }

  // ---- Buscar uno por id (404 si no existe o si el id no tiene formato de MongoDB) ----
  async findOne(id: string): Promise<ProductoDocument> {
    const producto = isValidObjectId(id) ? await this.productoModel.findById(id).exec() : null;
    if (!producto) throw new NotFoundException(`No existe ningún producto con id ${id}`);
    return producto;
  }

  // ---- Crear (MongoDB genera el id) ----
  create(dto: CreateProductoDto): Promise<ProductoDocument> {
    return this.productoModel.create(sinVacios(dto));
  }

  // ---- Modificar (solo los campos enviados) y devolver la versión nueva ----
  async update(id: string, dto: UpdateProductoDto): Promise<ProductoDocument> {
    const producto = isValidObjectId(id)
      ? await this.productoModel
          .findByIdAndUpdate(id, sinVacios(dto), { returnDocument: 'after', runValidators: true })
          .exec()
      : null;
    if (!producto) throw new NotFoundException(`No existe ningún producto con id ${id}`);
    return producto;
  }

  // ---- Borrar (devuelve el producto borrado) ----
  async remove(id: string): Promise<ProductoDocument> {
    const producto = isValidObjectId(id) ? await this.productoModel.findByIdAndDelete(id).exec() : null;
    if (!producto) throw new NotFoundException(`No existe ningún producto con id ${id}`);
    return producto;
  }
}
