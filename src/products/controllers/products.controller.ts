import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Put
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductsDto } from '../dtos/create-products.dto';
import { PartialUpdateProductsDto } from '../dtos/partial-update-products.dto';
import { ProductsResponseDto } from '../dtos/products-response.dto';
import { UpdateProductsDto } from '../dtos/update-products.dto';

@Controller('productos')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll(): Promise<ProductsResponseDto[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProductsResponseDto> {
    return await this.productsService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateProductsDto): Promise<ProductsResponseDto> {
    return await this.productsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductsDto,
  ): Promise<ProductsResponseDto> {
    return await this.productsService.update(id, dto);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PartialUpdateProductsDto
  ): Promise<ProductsResponseDto> {
    return await this.productsService.partialUpdate(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.delete(id);
    return { message: 'Producto eliminado exitosamente' };
  }
}