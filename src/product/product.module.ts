import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './infrastructure/http/product.controller';
import { ProductService } from './application/product.service';
import { ProductMongooseRepository } from './infrastructure/persistence/product-mongoose.repository';
import { PRODUCT_REPOSITORY } from './domain/product.repository.port';
import { ProductDocument, ProductSchema } from './infrastructure/persistence/product.schema';
import { ProductResolver } from './infrastructure/graphql/product.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProductDocument.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductResolver,
    { provide: PRODUCT_REPOSITORY, useClass: ProductMongooseRepository },
  ],
})
export class ProductModule {}
