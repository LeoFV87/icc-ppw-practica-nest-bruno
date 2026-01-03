import { CreateProductsDto } from '../dtos/create-products.dto';

import { ProductsResponseDto } from '../dtos/products-response.dto';
import { ProductEntity } from '../entities/products.entity';

export class ProductsMapper {

  static toEntity(dto: CreateProductsDto): ProductEntity {
    const entity = new ProductEntity();
    entity.name = dto.name;
    entity.price = dto.price; 
    entity.stock = dto.stock;
    return entity;
  }

  static toResponseDto(entity: ProductEntity): ProductsResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      price: Number(entity.price), 
      stock: entity.stock,
    };
  }
}