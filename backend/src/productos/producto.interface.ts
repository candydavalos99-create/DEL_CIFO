// Forma de un producto tal como lo guarda y lo devuelve la API
export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
}

// Categorías válidas (las mismas que el desplegable del frontend)
export const CATEGORIAS = [
  'portatil', 'sobremesa', 'movil', 'tablet', 'monitor', 'periferico', 'audio', 'otro',
];
