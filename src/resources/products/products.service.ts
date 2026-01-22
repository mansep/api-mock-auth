import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  private idCounter: number = 1000;

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    this.products = JSON.parse(productsData);
  }

  private generateId(): string {
    return `prod-${++this.idCounter}`;
  }

  findAll(): Product[] {
    return this.products;
  }

  findAllPaginated(query: PaginationQueryDto) {
    let filtered = [...this.products];

    // Search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (query.sortBy && filtered.length > 0 && query.sortBy in filtered[0]) {
      filtered.sort((a, b) => {
        const aVal = a[query.sortBy];
        const bVal = b[query.sortBy];
        const order = query.sortOrder === 'desc' ? -1 : 1;
        if (typeof aVal === 'string') {
          return aVal.localeCompare(bVal as string) * order;
        }
        return ((aVal as number) - (bVal as number)) * order;
      });
    }

    const total = filtered.length;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: this.generateId(),
      name: createProductDto.name,
      description: createProductDto.description,
      category: createProductDto.category,
      price: createProductDto.price,
      currency: createProductDto.currency || 'USD',
      stock: createProductDto.stock,
      sku: createProductDto.sku || `SKU-${Date.now()}`,
      brand: createProductDto.brand,
      imageUrl: createProductDto.imageUrl || 'https://via.placeholder.com/300',
      rating: 0,
      reviews: 0,
      active: createProductDto.active ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = {
      ...this.products[index],
      ...updateProductDto,
      updatedAt: new Date().toISOString(),
    };
    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  remove(id: string): { deleted: boolean; id: string } {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
    return { deleted: true, id };
  }
}
