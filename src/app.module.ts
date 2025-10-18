import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { CartItemsModule } from './cart-items/cart-items.module';

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
    ShoppingCartModule,
    CartItemsModule,
  ],
})
export class AppModule {}
