import { Product } from './product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepositoryPort {
  create(product: Omit<Product, 'id'>): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, product: Partial<Omit<Product, 'id'>>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
