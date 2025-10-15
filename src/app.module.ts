import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AddressesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
