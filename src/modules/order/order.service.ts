import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository, UpdateResult } from 'typeorm';
import { ClientService } from '../client/client.service';
import { ProductService } from '../product/product.service';
import { OrderDto } from './dto/order-dto';
import { Order } from './entity/order.entity';

@Injectable()
export class OrderService
{

  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private clientService: ClientService,
    private productService: ProductService
  ) { }


  async createOrder(orderDto: OrderDto)
  {
    const clientExist = await this.clientService.findClientById(orderDto.client.id);
    if (!clientExist)
    {
      throw new ConflictException("ERROR: El cliente con id '" + orderDto.client.id + "' no existe");
    }
    for (const p of orderDto.products)
    {
      const product = await this.productService.findProductById(p.id);
      if (!product)
      {
        throw new ConflictException("ERROR: El producto con id '" + p.id + "' no existe");
      }
      else if (product.deleted)
      {
        throw new ConflictException("ERROR: El producto con id '" + p.id + "' no esta disponible");
      }
    }
    return this.orderRepository.save(orderDto);
  }

  async getOrderById(id: string)
  {
    return this.orderRepository.findOne({ where: { id: id } });
  }


  getPendingOrders()
  {
    return this.orderRepository.find({
      where: { confirmAt: IsNull() }
    });
  }



  async getConfirmedOrders(start: Date, end: Date)
  {

    console.log("-- get --");
    console.log("-> start: " + start.getFullYear() + "-" + start.getMonth() + "-" + start.getDate());
    console.log("-> end: " + end.getFullYear() + "-" + end.getMonth() + "-" + end.getDate());

    console.log("\n-- getUTC --");
    console.log("-> start: " + start.getFullYear() + "-" + start.getUTCMonth() + "-" + start.getUTCDate());
    console.log("-> end: " + end.getFullYear() + "-" + end.getUTCMonth() + "-" + end.getUTCDate());

    console.log("\n-- PRE PROCESO --");
    console.log("-> start: " + start);
    console.log("-> end: " + end);
    console.log("\n-- toISOString() --");
    console.log("-> start.toISOString(): " + start.toISOString());
    console.log("-> end.toISOString(): " + end.toISOString());

    if (!isNaN(start.getTime()) || !isNaN(end.getTime()))
    {
      const query = this.orderRepository.createQueryBuilder("order")
        .leftJoinAndSelect("order.client", "client")
        .leftJoinAndSelect("order.products", "product")
        .orderBy("order.confirmAt");

      if (!isNaN(start.getTime()))
      {
        query.andWhere({ confirmAt: MoreThanOrEqual(start) });
      }

      if (!isNaN(end.getTime()))
      {
        // end.setDate(end.getDate() + 1); // parche 1
        end.setDate(end.getUTCDate()); // parche 2
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        query.andWhere({ confirmAt: LessThanOrEqual(end) });
        console.log("\n-- POS PROCESO --");
        console.log("-> end: " + end);
      }

      return await query.getMany();

    } else
    {
      return this.orderRepository.find({
        where: { confirmAt: Not(IsNull()) },
        order: { confirmAt: 'DESC' }
      });
    }
  }


  async patchConfirmOrder(id: string)
  {
    const orderExist = await this.getOrderById(id);
    if (!orderExist)
    {
      throw new ConflictException("ERROR: La orden con id '" + id + "' no existe");
    }
    else if (orderExist.confirmAt)
    {
      throw new ConflictException("ERROR: La orden con id '" + id + "' ya esta confirmada");
    }
    else
    {
      const row: UpdateResult = await this.orderRepository.update(
        { id: id },
        { confirmAt: new Date() }
      );
      return row.affected == 1;
    }
  }


  async getOrdersByIdClient(idClient: number)
  {
    const clientExist = await this.clientService.findClientById(idClient);
    if (!clientExist)
    {
      throw new ConflictException("ERROR: El cliente con id '" + idClient + "' no existe");
    }
    else if(clientExist)
    {
      return this.orderRepository.createQueryBuilder("order")
                                 .leftJoinAndSelect("order.client", "client")
                                 .leftJoinAndSelect("order.products", "products")
                                 .where("client.id = :idClient", { idClient })
                                 .orderBy("order.confirmAt", "DESC")
                                 .getMany();
    }
  }

}
