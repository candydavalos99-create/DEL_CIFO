import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import type { ProductoDocument } from './schemas/producto.schema.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

// Controlador: el "mostrador". Recibe cada petición HTTP en /productos
// y se la pasa al servicio. En la fase 3 las rutas NO cambian:
// el frontend no nota que ahora los datos están en MongoDB.
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // GET /productos → lista todos
  @Get()
  findAll(): Promise<ProductoDocument[]> {
    return this.productosService.findAll();
  }

  // GET /productos/:id → devuelve uno
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductoDocument> {
    return this.productosService.findOne(id);
  }

  // POST /productos → crea uno con los datos del cuerpo (JSON)
  @Post()
  create(@Body() dto: CreateProductoDto): Promise<ProductoDocument> {
    return this.productosService.create(dto);
  }

  // PATCH /productos/:id → modifica los campos enviados
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto): Promise<ProductoDocument> {
    return this.productosService.update(id, dto);
  }

  // DELETE /productos/:id → borra uno
  @Delete(':id')
  remove(@Param('id') id: string): Promise<ProductoDocument> {
    return this.productosService.remove(id);
  }
}
