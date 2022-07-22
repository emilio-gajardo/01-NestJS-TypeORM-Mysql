import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Client } from './entity/client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Address])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
