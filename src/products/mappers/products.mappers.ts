import { CreateProductsDto } from '../dtos/create-products.dto';
import { Products } from '../entities/products.entity';

export class ProductsMapper {
  static toEntity(id: number, dto: CreateProductsDto): Products {
    return new Products(id, dto.name, dto.precio, dto.stock);
  }

  static toResponseDto(products: Products) {
    return {
      id: products.id,
      name: products.name,
      precio: products.precio,
      stock: products.stock,
    };
  }
}
