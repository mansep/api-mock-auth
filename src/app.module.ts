import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { ProductsModule } from './resources/products/products.module';
import { SalesModule } from './resources/sales/sales.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, SalesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
