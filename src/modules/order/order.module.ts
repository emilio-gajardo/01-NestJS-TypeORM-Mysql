import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

import { Order } from './entity/order.entity';
import { ClientModule } from '../client/client.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), ClientModule, ProductModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
