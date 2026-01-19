import { ApiProperty } from '@nestjs/swagger';

export class SaleItemDto {
  @ApiProperty({ description: 'Product ID', example: 'prod-001' })
  productId: string;

  @ApiProperty({ description: 'Product name', example: 'Laptop Pro 15' })
  productName: string;

  @ApiProperty({ description: 'Quantity', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'Unit price', example: 1299.99 })
  unitPrice: number;

  @ApiProperty({ description: 'Item total', example: 2599.98 })
  total: number;
}

export class ShippingAddressDto {
  @ApiProperty({ description: 'Street', example: '123 Main Street' })
  street: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'NY' })
  state: string;

  @ApiProperty({ description: 'Zip code', example: '10001' })
  zipCode: string;

  @ApiProperty({ description: 'Country', example: 'USA' })
  country: string;
}

export class SaleDto {
  @ApiProperty({ description: 'Unique sale ID', example: 'sale-001' })
  id: string;

  @ApiProperty({ description: 'Order ID', example: 'ORD-2024-001' })
  orderId: string;

  @ApiProperty({ description: 'User ID', example: 'user-001' })
  userId: string;

  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  customerName: string;

  @ApiProperty({ description: 'Customer email', example: 'john@example.com' })
  customerEmail: string;

  @ApiProperty({ description: 'Sale status', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], example: 'delivered' })
  status: string;

  @ApiProperty({ description: 'Sale items', type: [SaleItemDto] })
  items: SaleItemDto[];

  @ApiProperty({ description: 'Subtotal', example: 2599.98 })
  subtotal: number;

  @ApiProperty({ description: 'Tax', example: 233.99 })
  tax: number;

  @ApiProperty({ description: 'Shipping cost', example: 15.00 })
  shipping: number;

  @ApiProperty({ description: 'Sale total', example: 2848.97 })
  total: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Payment method', example: 'credit_card' })
  paymentMethod: string;

  @ApiProperty({ description: 'Shipping address', type: ShippingAddressDto })
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ description: 'Creation date', example: '2024-01-15T10:30:00Z' })
  createdAt: string;

  @ApiProperty({ description: 'Last update date', example: '2024-01-20T15:45:00Z' })
  updatedAt: string;
}
