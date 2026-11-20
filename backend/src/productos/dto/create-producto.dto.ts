import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import { CATEGORIAS } from '../categorias.js';

// Quita espacios al principio y al final de los textos recibidos
const recortar = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

// DTO de creación: la "ficha de pedido" que debe traer un POST /productos.
// Cada etiqueta (@...) es una regla; si alguna no se cumple, NestJS responde 400.
export class CreateProductoDto {
  @recortar()
  @IsString({ message: 'nombre debe ser un texto' })
  @Length(2, 100, { message: 'nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @recortar()
  @IsString({ message: 'marca debe ser un texto' })
  @IsNotEmpty({ message: 'marca es obligatoria' })
  marca: string;

  @IsIn(CATEGORIAS, { message: `categoria debe ser una de: ${CATEGORIAS.join(', ')}` })
  categoria: string;

  @IsNumber({}, { message: 'precio debe ser un número' })
  @Min(0, { message: 'precio debe ser mayor o igual que 0' })
  precio: number;

  @IsOptional()
  @IsInt({ message: 'stock debe ser un número entero' })
  @Min(0, { message: 'stock debe ser mayor o igual que 0' })
  stock?: number;

  @IsOptional()
  @recortar()
  @IsString({ message: 'descripcion debe ser un texto' })
  @MaxLength(500, { message: 'descripcion no puede superar 500 caracteres' })
  descripcion?: string;
}
