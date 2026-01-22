import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FilterQueryDto } from '../../common/dto/filter-query.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

export interface Sale {
  id: string;
  orderId: string;
  userId: string;
  customerInfo?: {
    name: string;
    email: string;
    phone?: string;
    isGuest?: boolean;
  };
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    total: number;
    variant?: Record<string, any>;
    discount?: Record<string, any>;
  }>;
  pricing?: {
    subtotal: number;
    discount?: { type: string; value: number; amount: number };
    tax: { rate: number; amount: number };
    shipping: number;
    total: number;
  };
  currency: string;
  paymentMethod: string;
  paymentDetails?: Record<string, any>;
  shippingAddress?: Record<string, any>;
  billingAddress?: Record<string, any>;
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    events?: Array<{ date: string; status: string; location: string; description: string }>;
  };
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

@Injectable()
export class SalesService {
  private sales: Sale[];
  private idCounter: number = 1000;
  private orderCounter: number = 10000;

  constructor() {
    this.loadSales();
  }

  private loadSales() {
    try {
      const salesPath = path.join(process.cwd(), 'data', 'sales.json');
      const salesData = fs.readFileSync(salesPath, 'utf-8');
      this.sales = JSON.parse(salesData);
    } catch {
      this.sales = [];
    }
  }

  private generateId(): string {
    return `sale-${++this.idCounter}`;
  }

  private generateOrderId(): string {
    return `ORD-${new Date().getFullYear()}-${++this.orderCounter}`;
  }

  private getNestedValue(obj: any, pathStr: string): any {
    return pathStr.split('.').reduce((current, key) => current?.[key], obj);
  }

  findAll(): Sale[] {
    return this.sales;
  }

  findAllPaginated(query: FilterQueryDto) {
    let filtered = [...this.sales];

    // Global search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter((s) => {
        const searchableText = [
          s.orderId,
          s.customerInfo?.name,
          s.customerInfo?.email,
          s.status,
          s.paymentMethod,
          s.tracking?.carrier,
          s.tracking?.trackingNumber,
          ...s.items.map(i => i.productName),
          ...(s.tags || []),
        ].filter(Boolean).join(' ').toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    // Field-specific filters
    if (query.status) {
      filtered = filtered.filter((s) => 
        s.status.toLowerCase() === query.status.toLowerCase()
      );
    }

    if (query.paymentMethod) {
      filtered = filtered.filter((s) => 
        s.paymentMethod.toLowerCase() === query.paymentMethod.toLowerCase()
      );
    }

    if (query.productId) {
      filtered = filtered.filter((s) => 
        s.items.some(i => i.productId === query.productId)
      );
    }

    if (query.country) {
      filtered = filtered.filter((s) => 
        s.shippingAddress?.country?.toLowerCase() === query.country.toLowerCase()
      );
    }

    if (query.city) {
      filtered = filtered.filter((s) => 
        s.shippingAddress?.city?.toLowerCase() === query.city.toLowerCase()
      );
    }

    // Amount range filters
    if (query.minTotal !== undefined) {
      filtered = filtered.filter((s) => {
        const total = s.pricing?.total ?? s['total'] ?? 0;
        return total >= query.minTotal;
      });
    }

    if (query.maxTotal !== undefined) {
      filtered = filtered.filter((s) => {
        const total = s.pricing?.total ?? s['total'] ?? 0;
        return total <= query.maxTotal;
      });
    }

    // Tags filter (comma-separated, match any)
    if (query.tags) {
      const tagsToMatch = query.tags.split(',').map((t) => t.trim().toLowerCase());
      filtered = filtered.filter((s) =>
        s.tags?.some((tag) => tagsToMatch.includes(tag.toLowerCase()))
      );
    }

    // Date range filters
    if (query.createdAfter) {
      const afterDate = new Date(query.createdAfter);
      filtered = filtered.filter((s) => new Date(s.createdAt) >= afterDate);
    }

    if (query.createdBefore) {
      const beforeDate = new Date(query.createdBefore);
      filtered = filtered.filter((s) => new Date(s.createdAt) <= beforeDate);
    }

    if (query.updatedAfter) {
      const afterDate = new Date(query.updatedAfter);
      filtered = filtered.filter((s) => new Date(s.updatedAt) >= afterDate);
    }

    if (query.updatedBefore) {
      const beforeDate = new Date(query.updatedBefore);
      filtered = filtered.filter((s) => new Date(s.updatedAt) <= beforeDate);
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
        return selected as Sale;
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
        status: query.status || null,
        paymentMethod: query.paymentMethod || null,
        totalRange: query.minTotal !== undefined || query.maxTotal !== undefined 
          ? { min: query.minTotal, max: query.maxTotal } : null,
        dateRange: query.createdAfter || query.createdBefore 
          ? { after: query.createdAfter, before: query.createdBefore } : null,
      },
    };
  }

  findOne(id: string): Sale {
    const sale = this.sales.find((s) => s.id === id);
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  create(createSaleDto: CreateSaleDto): Sale {
    const now = new Date().toISOString();
    
    // Calculate totals
    const items = createSaleDto.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = Math.round(subtotal * 0.1 * 100) / 100;
    const shippingAmount = 15.00;
    const totalAmount = Math.round((subtotal + taxAmount + shippingAmount) * 100) / 100;

    const newSale: Sale = {
      id: this.generateId(),
      orderId: this.generateOrderId(),
      userId: createSaleDto.userId,
      customerInfo: {
        name: createSaleDto.customerName,
        email: createSaleDto.customerEmail,
        isGuest: false,
      },
      status: 'pending',
      items,
      pricing: {
        subtotal: Math.round(subtotal * 100) / 100,
        tax: { rate: 0.10, amount: taxAmount },
        shipping: shippingAmount,
        total: totalAmount,
      },
      currency: createSaleDto.currency || 'USD',
      paymentMethod: createSaleDto.paymentMethod || 'credit_card',
      shippingAddress: createSaleDto.shippingAddress,
      createdAt: now,
      updatedAt: now,
    };
    this.sales.push(newSale);
    return newSale;
  }

  update(id: string, updateSaleDto: UpdateSaleDto): Sale {
    const index = this.sales.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    const updatedSale = {
      ...this.sales[index],
      ...updateSaleDto,
      updatedAt: new Date().toISOString(),
    };
    this.sales[index] = updatedSale;
    return updatedSale;
  }

  remove(id: string): { deleted: boolean; id: string } {
    const index = this.sales.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    this.sales.splice(index, 1);
    return { deleted: true, id };
  }
}
