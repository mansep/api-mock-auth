import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Whether there is a previous page' })
  hasPrevPage: boolean;
}

export class PaginatedProductResponseDto {
  @ApiProperty({
    example: [
      {
        id: 'prod-001',
        name: 'MacBook Pro 16"',
        description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD',
        price: 2499.99,
        category: 'Electronics',
        stock: 45,
        sku: 'MBP16-M3-512',
        active: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-20T15:45:00.000Z',
      },
      {
        id: 'prod-002',
        name: 'iPhone 15 Pro',
        description: 'A17 Pro chip, 256GB, Titanium',
        price: 1199.99,
        category: 'Electronics',
        stock: 120,
        sku: 'IP15P-256-TI',
        active: true,
        createdAt: '2024-01-10T08:00:00.000Z',
        updatedAt: '2024-01-18T12:30:00.000Z',
      },
    ],
    description: 'Array of products',
  })
  data: any[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginatedUserResponseDto {
  @ApiProperty({
    example: [
      {
        id: 'user-001',
        username: 'johndoe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
        active: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLogin: '2024-01-22T09:15:00.000Z',
      },
      {
        id: 'user-002',
        username: 'janedoe',
        email: 'jane.doe@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user',
        active: true,
        createdAt: '2024-01-05T14:30:00.000Z',
        lastLogin: '2024-01-21T16:45:00.000Z',
      },
    ],
    description: 'Array of users',
  })
  data: any[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class PaginatedSaleResponseDto {
  @ApiProperty({
    example: [
      {
        id: 'sale-001',
        customerId: 'user-001',
        customerEmail: 'john.doe@example.com',
        items: [
          { productId: 'prod-001', productName: 'MacBook Pro 16"', quantity: 1, unitPrice: 2499.99, total: 2499.99 },
        ],
        subtotal: 2499.99,
        tax: 250.0,
        shipping: 15.0,
        total: 2764.99,
        status: 'completed',
        paymentMethod: 'credit_card',
        shippingAddress: {
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA',
        },
        createdAt: '2024-01-20T14:30:00.000Z',
        updatedAt: '2024-01-20T14:30:00.000Z',
      },
    ],
    description: 'Array of sales',
  })
  data: any[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
