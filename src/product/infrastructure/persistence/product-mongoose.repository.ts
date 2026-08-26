import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../domain/product.entity';
import { ProductRepositoryPort } from '../../domain/product.repository.port';
import { ProductDocument } from './product.schema';

@Injectable()
export class ProductMongooseRepository implements ProductRepositoryPort {
  constructor(
    @InjectModel(ProductDocument.name)
    private readonly model: Model<ProductDocument>,
  ) {}

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const created = await this.model.create(product);
    return this.toDomain(created);
  }

  async findAll(): Promise<Product[]> {
    const docs = await this.model.find().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findById(id: string): Promise<Product | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async update(id: string, product: Partial<Omit<Product, 'id'>>): Promise<Product | null> {
    const doc = await this.model.findByIdAndUpdate(id, product, { new: true }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private toDomain(doc: ProductDocument): Product {
    return new Product(doc._id.toString(), doc.name, doc.description, doc.price);
  }
}
