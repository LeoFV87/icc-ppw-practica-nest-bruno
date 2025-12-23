import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Products } from '../entities/products.entity';
import { ProductsMapper } from '../mappers/products.mappers';
import { CreateProductsDto } from '../dtos/create-products.dto';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';

@Controller('productos')
export class ProductsController {
private products: Array<Products> = [];
  private currentId = 1;
  
  @Get()
  findAll() {
    return this.products.map((u) => ProductsMapper.toResponseDto(u));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const product = this.products.find((u) => u.id === Number(id));
    if (!product) return { error: 'Product not found' };
    return ProductsMapper.toResponseDto(product);
  }

  @Post()
  create(@Body() dto: CreateProductsDto) {
    const entity = ProductsMapper.toEntity(this.currentId++, dto);
    this.products.push(entity);
    return ProductsMapper.toResponseDto(entity);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateProductsDto) {
    const product = this.products.find((u) => u.id === Number(id));
    if (!product) return { error: 'Product not found' };

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.precio !== undefined) product.precio = dto.precio;
    if (dto.stock !== undefined) product.stock = dto.stock;
    return ProductsMapper.toResponseDto(product);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const exists = this.products.some((u) => u.id === Number(id));
    if (!exists) return { error: 'Product not found' };

    this.products = this.products.filter((u) => u.id !== Number(id));
    return { message: 'Deleted successfully' };
  }
}
