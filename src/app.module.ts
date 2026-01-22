import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { ProductsModule } from './resources/products/products.module';
import { SalesModule } from './resources/sales/sales.module';
import { LandingModule } from './landing/landing.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [LandingModule, AuthModule, UsersModule, ProductsModule, SalesModule, UploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
