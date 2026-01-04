import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.model';
import { CreateProductsDto } from '../dtos/create-products.dto';
import { UpdateProductsDto } from '../dtos/update-products.dto';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';
import { ProductEntity } from '../entities/products.entity';


import { NotFoundException } from 'src/exceptions/domain/not-found.exception';
import { ConflictException } from 'src/exceptions/domain/conflict.exception';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductsDto) {
    // 1. Buscamos si ya existe un producto con ese nombre
    const existingProduct = await this.productRepo.findOne({
      where: { name: createProductDto.name },
    });

    // 2. Si existe, lanzamos el error 409
    if (existingProduct) {
      throw new ConflictException('El nombre del producto ya existe');
    }

    // 3. Si no existe, lo creamos
    const newProduct = this.productRepo.create(createProductDto);
    return await this.productRepo.save(newProduct);
  }

  async findAll(): Promise<ProductsResponseDto[]> {
    const entities = await this.productRepo.find();
    return entities
      .map(Product.fromEntity)
      .map(p => p.toResponseDto());
  }

  async findOne(id: number): Promise<ProductsResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    
    // Usamos tu nueva NotFoundException personalizada
    if (!entity) {
        throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }
    
    return Product.fromEntity(entity).toResponseDto();
  }

  /**
   * Actualización completa (PUT)
   */
  async update(id: number, dto: UpdateProductsDto): Promise<ProductsResponseDto> {
    const entity = await this.productRepo.findOne({ where: { id } });
    
    // Usamos la excepción personalizada
    if (!entity) {
        throw new NotFoundException(`No se puede actualizar: Producto no encontrado (ID: ${id})`);
    }

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
    
    if (!entity) {
        throw new NotFoundException(`No se puede actualizar parcialmente: Producto no encontrado (ID: ${id})`);
    }

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
      // Usamos la excepción personalizada para la eliminación
      throw new NotFoundException(`No se puede eliminar: Producto no encontrado con ID: ${id}`);
    }
  }
}