import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from '../../application/product.service';
import { CreateProductDto } from '../../application/dto/create-product.dto';
import { Product } from '../../domain/product.entity';
import { GrpcExceptionFilter } from '../../../common/filters/grpc-exception.filter';
import { ProductByIdRequest } from './dto/product-by-id.request';
import { UpdateProductRequest } from './dto/update-product.request';

@Controller()
@UseFilters(new GrpcExceptionFilter())
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'Create')
  async create(data: CreateProductDto): Promise<Product> {
    return this.productService.create(data);
  }

  @GrpcMethod('ProductService', 'FindAll')
  async findAll(): Promise<{ items: Product[] }> {
    const items = await this.productService.findAll();
    return { items };
  }

  @GrpcMethod('ProductService', 'FindOne')
  async findOne(data: ProductByIdRequest): Promise<Product> {
    return this.productService.findOne(data.id);
  }

  @GrpcMethod('ProductService', 'Update')
  async update(data: UpdateProductRequest): Promise<Product> {
    const { id, ...dto } = data;
    return this.productService.update(id, dto);
  }

  @GrpcMethod('ProductService', 'Remove')
  async remove(data: ProductByIdRequest): Promise<{ success: boolean }> {
    await this.productService.remove(data.id);
    return { success: true };
  }
}
