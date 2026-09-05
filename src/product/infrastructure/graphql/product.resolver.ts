import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from '../../application/product.service';
import { ProductType } from './product.type';
import { CreateProductInput, UpdateProductInput } from './product.input';

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductType])
  products() {
    return this.productService.findAll();
  }

  @Query(() => ProductType)
  product(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductType)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.productService.create(input);
  }

  @Mutation(() => ProductType)
  updateProduct(@Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateProductInput) {
    return this.productService.update(id, input);
  }

  @Mutation(() => Boolean)
  async removeProduct(@Args('id', { type: () => ID }) id: string) {
    await this.productService.remove(id);
    return true;
  }
}
