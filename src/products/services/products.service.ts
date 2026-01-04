import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.model';
import { CreateProductsDto } from '../dtos/create-products.dto';
import { UpdateProductsDto } from '../dtos/update-products.dto';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';
import { ProductEntity } from '../entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductsDto) {
  // Validación de dominio (Reglas de negocio)
  const product = Product.fromDto(dto);
  
  const saved = await this.productRepo.save(product.toEntity());
  return Product.fromEntity(saved).toResponseDto();
}

  async findAll(): Promise<ProductsResponseDto[]> {
    const entities = await this.productRepo.find();
    return entities
      .map(Product.fromEntity)
      .map(p => p.toResponseDto());
  }

  async findOne(id: number): Promise<ProductsResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Product ${id} not found`);
    return Product.fromEntity(entity).toResponseDto();
  }

  /**
   * Actualización completa (PUT)
   */
  async update(id: number, dto: UpdateProductsDto): Promise<ProductsResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Product ${id} not found`);

    // Flujo funcional: Entity -> Domain -> Update -> Entity
    const updatedModel = Product.fromEntity(entity).update(dto);
    const saved = await this.productRepo.save(updatedModel.toEntity());

    return Product.fromEntity(saved).toResponseDto();
  }

  /**
   * Actualización parcial (PATCH)
   */
  async partialUpdate(id: number, dto: PartialUpdateProductsDto): Promise<ProductsResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Product ${id} not found`);

    // Flujo funcional: Entity -> Domain -> PartialUpdate -> Entity
    const updatedModel = Product.fromEntity(entity).partialUpdate(dto);
    const saved = await this.productRepo.save(updatedModel.toEntity());

    return Product.fromEntity(saved).toResponseDto();
  }

  /**
   * Eliminación física (DELETE)
   */
  async delete(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product ${id} not found`);
    }
  }
}