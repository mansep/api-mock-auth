import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  stock: number;
  sku: string;
  brand: string;
  tags?: string[];
  specifications?: Record<string, any>;
  images?: Array<{ url: string; alt: string; isPrimary: boolean }>;
  variants?: Array<{ id: string; name: string; sku: string; priceModifier: number; stock: number }>;
  rating: number;
  reviewCount?: number;
  reviews?: Array<{ userId: string; userName: string; rating: number; comment: string; createdAt: string }>;
  shipping?: Record<string, any>;
  active: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

@Injectable()
export class ProductsService {
  private products: Product[];
  private idCounter: number = 1000;

  constructor() {
    this.loadProducts();
  }

  private loadProducts() {
    try {
      const productsPath = path.join(process.cwd(), 'data', 'products.json');
      const productsData = fs.readFileSync(productsPath, 'utf-8');
      this.products = JSON.parse(productsData);
    } catch {
      this.products = [];
    }
  }

  private generateId(): string {
    return `prod-${++this.idCounter}`;
  }

  private getNestedValue(obj: any, pathStr: string): any {
    return pathStr.split('.').reduce((current, key) => current?.[key], obj);
  }

  findAll(): Product[] {
    return this.products;
  }

  findAllPaginated(query: FilterQueryDto) {
    let filtered = [...this.products];

    // Global search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter((p) => {
        const searchableText = [
          p.name,
          p.description,
          p.category,
          p.subcategory,
          p.brand,
          p.sku,
          ...(p.tags || []),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    // Field-specific filters
    if (query.category) {
      filtered = filtered.filter((p) => 
        p.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    if (query.brand) {
      filtered = filtered.filter((p) => 
        p.brand.toLowerCase() === query.brand.toLowerCase()
      );
    }

    if (query.active !== undefined) {
      filtered = filtered.filter((p) => p.active === query.active);
    }

    // Numeric range filters
    if (query.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= query.maxPrice);
    }

    if (query.minStock !== undefined) {
      filtered = filtered.filter((p) => p.stock >= query.minStock);
    }

    if (query.maxStock !== undefined) {
      filtered = filtered.filter((p) => p.stock <= query.maxStock);
    }

    if (query.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= query.minRating);
    }

    // Tags filter (comma-separated, match any)
    if (query.tags) {
      const tagsToMatch = query.tags.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((p) =>
        p.tags?.some((tag) => tagsToMatch.includes(tag.toLowerCase()))
      );
    }

    // Date range filters
    if (query.createdAfter) {
      const afterDate = new Date(query.createdAfter);
      filtered = filtered.filter((p) => new Date(p.createdAt) >= afterDate);
    }

    if (query.createdBefore) {
      const beforeDate = new Date(query.createdBefore);
      filtered = filtered.filter((p) => new Date(p.createdAt) <= beforeDate);
    }

    if (query.updatedAfter) {
      const afterDate = new Date(query.updatedAfter);
      filtered = filtered.filter((p) => new Date(p.updatedAt) >= afterDate);
    }

    if (query.updatedBefore) {
      const beforeDate = new Date(query.updatedBefore);
      filtered = filtered.filter((p) => new Date(p.updatedAt) <= beforeDate);
    }

    // Sort with nested field support
    if (query.sortBy && filtered.length > 0) {
      filtered.sort((a, b) => {
        const aVal = this.getNestedValue(a, query.sortBy);
        const bVal = this.getNestedValue(b, query.sortBy);
        const order = query.sortOrder === 'desc' ? -1 : 1;
        
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        
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
    let data = filtered.slice(startIndex, startIndex + limit);

    // Select specific fields
    if (query.fields) {
      const fieldsToSelect = query.fields.split(',').map((f) => f.trim());
      data = data.map((item) => {
        const selected: Record<string, any> = { id: item.id };
        fieldsToSelect.forEach((field) => {
          if (field.includes('.')) {
            const value = this.getNestedValue(item, field);
            if (value !== undefined) selected[field] = value;
          } else if (item[field] !== undefined) {
            selected[field] = item[field];
          }
        });
        return selected as Product;
      });
    }

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
      filters: {
        search: query.search || null,
        category: query.category || null,
        brand: query.brand || null,
        priceRange: query.minPrice !== undefined || query.maxPrice !== undefined 
          ? { min: query.minPrice, max: query.maxPrice } : null,
        dateRange: query.createdAfter || query.createdBefore 
          ? { after: query.createdAfter, before: query.createdBefore } : null,
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
      images: [{ url: createProductDto.imageUrl || 'https://via.placeholder.com/300', alt: createProductDto.name, isPrimary: true }],
      rating: 0,
      reviewCount: 0,
      reviews: [],
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
