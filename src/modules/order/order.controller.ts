import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order-dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/orders')
@ApiTags("ordenes")
export class OrderController
{

  constructor(private orderService: OrderService) { }

  @Post()
  @ApiOperation({ description: "Agrega una nueva orden" })
  @ApiBody({ description: "Agrega una nueva orden en base a OrderDto", type: OrderDto, examples: {
      ejemplo1: { value: { client: { id: 1 }, products: [{ id: 1 }, { id: 2 }, { id: 3 }] } },
      ejemplo2: { value: { client: { id: 2 }, products: [{ id: 1 }, { id: 2 }, { id: 3 }], confirmAt: "2022-07-21" } }}})
  @ApiResponse({ status: 201, description: "Registro agregado ok"})
  @ApiResponse({ status: 409, description: `ERROR: El id del cliente no existe. <br/>El id del producto no existe. <br/>El producto no esta disponible` })
  createOrder(@Body() orderDto: OrderDto)
  {
    return this.orderService.createOrder(orderDto);
  }


  @Get('/pending')
  @ApiOperation({ description: "Retorna todas los ordenes con estado pendiente o sin confirmar (confirmAt == null)" })
  getPendingOrders()
  {
    return this.orderService.getPendingOrders();
  }

  @Get('/confirmed')
  @ApiOperation({ description: "Retorna todas los ordenes con estado confirmado. Puede filtrar en el rango de fecha entregado" })
  @ApiQuery({ name: "start", type: Date, required: false, description: "Fecha de inicio de la busqueda" })
  @ApiQuery({ name: "end", type: Date, required: false, description: "Fecha de fin de la busqueda" })
  getConfirmedOrders(@Query('start') start: Date, @Query('end') end: Date)
  {
    return this.orderService.getConfirmedOrders(start, end);
  }


  @Get('/:id')
  @ApiOperation({ description: "Retorna una orden usando el id de la orden" })
  @ApiParam({ name: "id", type: String, required: true, description: "Id de una orden (uuid)" })
  @ApiResponse({ status: 200, description: "Retorna el registro ok" })
  @ApiResponse({ status: 409, description: "ERROR: No existe el id de esa orden" })
  getOrderById(@Param('id') id: string)
  {
    return this.orderService.getOrderById(id);
  }


  @Patch('/confirm/:idOrden')
  @ApiOperation({ description: "Modifica el estado de una orden en base al id de la orden. Inserta la fecha actual en el campo confirmAt" })
  @ApiParam({ name: "idOrden", type: String, required: true, description: "Id de una orden" })
  @ApiResponse({ status: 200, description: "Modifica el registro ok" })
  @ApiResponse({ status: 409, description: `ERROR: <br/>El id de la orden no existe. <br/>La orden ya está confirmada` })
  patchConfirmOrder(@Param('idOrden') idOrden: string)
  {
    return this.orderService.patchConfirmOrder(idOrden);
  }

  @Get('/client/:idClient')
  @ApiOperation({ description: "Retorna las ordenes asociadas al id de un cliente" })
  @ApiParam({ name: "idCliente", type: Number, required: true, description: "Id de un cliente" })
  @ApiResponse({ status: 200, description: "Retorna registros ok" })
  @ApiResponse({ status: 409, description: "ERROR: El id del cliente no existe" })
  getOrdersByIdClient(@Param('idClient') idClient: number)
  {
    return this.orderService.getOrdersByIdClient(idClient);
  }

}
