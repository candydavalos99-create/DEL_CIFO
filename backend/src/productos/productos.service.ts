import { Injectable, NotFoundException } from '@nestjs/common';
import type { Producto } from './producto.interface.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

// Servicio: el "almacén" y su encargado. Guarda los datos y aplica las reglas.
@Injectable()
export class ProductosService {
  // Fase 2: los datos viven en un array en la MEMORIA DEL SERVIDOR.
  // Sobreviven a recargar la página, pero se pierden al reiniciar el servidor.
  private productos: Producto[] = [
    { id: '1', nombre: 'MacBook Air 13"', marca: 'Apple', categoria: 'portatil', precio: 1199, stock: 5, descripcion: 'Portátil ligero con chip M3.' },
    { id: '2', nombre: 'MX Master 3S', marca: 'Logitech', categoria: 'periferico', precio: 109.99, stock: 12, descripcion: 'Ratón ergonómico inalámbrico.' },
    { id: '3', nombre: 'ThinkVision P27h', marca: 'Lenovo', categoria: 'monitor', precio: 349, stock: 0, descripcion: '' },
  ];

  // El id se genera "a mano" con un contador (en la fase 3 lo hará MongoDB)
  private siguienteId = 4;

  // ---- Listar todos ----
  findAll(): Producto[] {
    return this.productos;
  }

  // ---- Buscar uno por id (404 si no existe) ----
  findOne(id: string): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) throw new NotFoundException(`No existe ningún producto con id ${id}`);
    return producto;
  }

  // ---- Crear (los datos ya llegan validados por el DTO) ----
  create(dto: CreateProductoDto): Producto {
    const nuevo: Producto = {
      id: String(this.siguienteId++),
      nombre: dto.nombre,
      marca: dto.marca,
      categoria: dto.categoria,
      precio: dto.precio,
      stock: dto.stock ?? 0,
      descripcion: dto.descripcion ?? '',
    };
    this.productos.push(nuevo);
    return nuevo;
  }

  // ---- Modificar (solo los campos enviados) ----
  update(id: string, dto: UpdateProductoDto): Producto {
    const actual = this.findOne(id);
    // Solo copiamos los campos que traen valor: los que no se enviaron
    // llegan como "undefined" y no deben borrar los datos que ya había.
    const cambios = Object.fromEntries(Object.entries(dto).filter(([, valor]) => valor !== undefined));
    const modificado: Producto = { ...actual, ...cambios, id: actual.id };
    this.productos = this.productos.map((p) => (p.id === id ? modificado : p));
    return modificado;
  }

  // ---- Borrar (devuelve el producto borrado) ----
  remove(id: string): Producto {
    const producto = this.findOne(id);
    this.productos = this.productos.filter((p) => p.id !== id);
    return producto;
  }
}
