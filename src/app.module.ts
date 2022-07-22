import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';

import { ProductModule } from './modules/product/product.module';
import { ClientModule } from './modules/client/client.module';
import { OrderModule } from './modules/order/order.module';


@Module({
  imports: [
    ProductModule, ClientModule, OrderModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
