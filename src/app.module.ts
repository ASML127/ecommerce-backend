import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductImagesModule } from './product-images/product-images.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AddressesModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
  ],
})
export class AppModule {}
