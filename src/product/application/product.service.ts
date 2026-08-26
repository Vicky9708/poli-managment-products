import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../domain/product.entity';
import { ProductNotFoundError } from '../domain/product-not-found.error';
import { PRODUCT_REPOSITORY, ProductRepositoryPort } from '../domain/product.repository.port';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryPort,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.repository.create(dto);
  }

  findAll(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.repository.update(id, dto);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ProductNotFoundError(id);
    }
  }
}
