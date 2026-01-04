import { CreateProductsDto } from '../dtos/create-products.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';
import { UpdateProductsDto } from '../dtos/update-products.dto';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { ProductEntity } from '../entities/products.entity';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public stock: number,
    public createdAt: Date,
  ) {
    if (!name || name.trim().length < 3) throw new Error("Nombre inválido");
    if (price < 0) throw new Error("Precio negativo");
    if (stock < 0) throw new Error("Stock negativo");
  }

  // ==================== FACTORY METHODS ====================

  static fromDto(dto: CreateProductsDto): Product {
    return new Product(0, dto.name, dto.price, dto.stock, new Date());
  }

  static fromEntity(entity: ProductEntity): Product {
    return new Product(entity.id, entity.name, entity.price, entity.stock, entity.createdAt);
  }

  // ==================== CONVERSION METHODS ====================

  toEntity(): ProductEntity {
    const entity = new ProductEntity();
    if (this.id > 0) entity.id = this.id;
    entity.name = this.name;
    entity.price = this.price;
    entity.stock = this.stock;
    return entity;
  }

  toResponseDto(): ProductsResponseDto {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      stock: this.stock
    };
  }

  // ==================== UPDATE METHODS ====================

  update(dto: UpdateProductsDto): Product {
    this.name = dto.name ?? this.name;
    this.price = dto.price ?? this.price;
    this.stock = dto.stock ?? this.stock;
    return this;
  }

  partialUpdate(dto: PartialUpdateProductsDto): Product {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.price !== undefined) this.price = dto.price;
    if (dto.stock !== undefined) this.stock = dto.stock;
    return this;
  }
}