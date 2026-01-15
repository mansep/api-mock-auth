import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  sku: string;
  brand: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ProductsService {
  private products: Product[];

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    this.products = JSON.parse(productsData);
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
