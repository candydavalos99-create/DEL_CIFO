import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { CATEGORIAS } from '../categorias.js';

// Esquema: la "plantilla de ficha" de cada producto guardado en MongoDB.
// Mongoose lo usa para validar y para traducir entre objetos de JS y documentos de la base de datos.
@Schema({
  collection: 'productos', // nombre de la colección (la "estantería") dentro de la BD catalogo
  timestamps: true,        // añade createdAt y updatedAt automáticamente
  versionKey: false,       // no guarda el campo interno __v
  toJSON: {
    // Al responder en JSON: mostramos "id" (texto) en lugar de "_id",
    // para que el frontend reciba el mismo formato que en la fase 2.
    virtuals: true,
    transform: (_documento: unknown, ret: Record<string, unknown>) => {
      delete ret._id;
      return ret;
    },
  },
})
export class Producto {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 100 })
  nombre: string;

  @Prop({ required: true, trim: true })
  marca: string;

  @Prop({ required: true, enum: CATEGORIAS })
  categoria: string;

  @Prop({ required: true, min: 0 })
  precio: number;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ default: '', trim: true, maxlength: 500 })
  descripcion: string;
}

// Un producto tal como lo devuelve Mongoose (con _id, createdAt, updatedAt...)
export type ProductoDocument = HydratedDocument<Producto>;

// El esquema real que Mongoose registra a partir de la clase
export const ProductoSchema = SchemaFactory.createForClass(Producto);
