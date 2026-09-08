import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(Product) private readonly productsRepository: Repository<Product>) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productsRepository.create(createProductDto);

    return this.productsRepository.save(product);
  }

  async findAll() {
    return await this.productsRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);

    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    await this.productsRepository.remove(product);

    return {
      message: 'Product deleted successfully',
    };
  }
}
