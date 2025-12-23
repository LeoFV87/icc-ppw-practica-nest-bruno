export class Products {
  id: number;
  name: string;
  precio: number;
  stock: number;
  createidAt: Date;
  constructor(id: number, name: string, precio: number, stock: number) {
    this.id = id;
    this.name = name;
    this.precio = precio;
    this.stock = stock;
    this.createidAt = new Date();
  }
}
