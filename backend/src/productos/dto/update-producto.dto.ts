import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import { CATEGORIAS } from '../categorias.js';

const recortar = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

// DTO de modificación: la ficha de un PATCH /productos/:id.
// Mismas reglas que al crear, pero todos los campos son opcionales (@IsOptional):
// solo se comprueban los que se envían.
export class UpdateProductoDto {
  @IsOptional()
  @recortar()
  @IsString({ message: 'nombre debe ser un texto' })
  @Length(2, 100, { message: 'nombre debe tener entre 2 y 100 caracteres' })
  nombre?: string;

  @IsOptional()
  @recortar()
  @IsString({ message: 'marca debe ser un texto' })
  @IsNotEmpty({ message: 'marca no puede estar vacía' })
  marca?: string;

  @IsOptional()
  @IsIn(CATEGORIAS, { message: `categoria debe ser una de: ${CATEGORIAS.join(', ')}` })
  categoria?: string;

  @IsOptional()
  @IsNumber({}, { message: 'precio debe ser un número' })
  @Min(0, { message: 'precio debe ser mayor o igual que 0' })
  precio?: number;

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
