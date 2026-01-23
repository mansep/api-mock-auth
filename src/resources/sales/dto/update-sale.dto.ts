import { ApiPropertyOptional, ApiExtraModels } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

/**
 * UpdateSaleDto - Accepts any field for mock testing
 * This is a mock API, so we allow updating any field without restrictions
 */
@ApiExtraModels()
export class UpdateSaleDto {
  @ApiPropertyOptional({ description: 'Sale status', example: 'shipped' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Payment method', example: 'paypal' })
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Customer info', example: { name: 'John Doe', email: 'john@example.com', phone: '+1-555-0123' } })
  @IsOptional()
  customerInfo?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Order items', type: 'array', example: [{ productId: 'prod-001', quantity: 2, unitPrice: 99.99 }] })
  @IsOptional()
  items?: any[];

  @ApiPropertyOptional({ description: 'Pricing details', example: { subtotal: 199.98, tax: { rate: 0.1, amount: 19.99 }, shipping: 10, total: 229.97 } })
  @IsOptional()
  pricing?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Payment details', example: { cardLast4: '4242', cardBrand: 'visa' } })
  @IsOptional()
  paymentDetails?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Shipping address', example: { street: '123 Main St', city: 'NYC', country: 'USA' } })
  @IsOptional()
  shippingAddress?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Billing address', example: { street: '123 Main St', city: 'NYC', country: 'USA' } })
  @IsOptional()
  billingAddress?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tracking info', example: { carrier: 'FedEx', trackingNumber: 'FDX123456' } })
  @IsOptional()
  tracking?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Order notes', example: 'Gift wrap requested' })
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Order tags', example: ['priority', 'gift'], type: [String] })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Currency', example: 'USD' })
  @IsOptional()
  currency?: string;

  /** Allow any additional fields */
  [key: string]: any;
}
