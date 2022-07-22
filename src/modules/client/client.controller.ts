import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client-dto';

@Controller('api/v1/clients')
@ApiTags("clientes")
export class ClientController
{

  constructor(private clientService: ClientService) { }

  @Post()
  @ApiOperation({ description: "Agrega un nuevo cliente" })
  @ApiBody({
    description: "Agrega un nuevo cliente usando un ClientDto",
    type: ClientDto,
    examples: {
      ejemplo1: { value: { name: "Klee", email: "klee@gmail.com", address: { country: "Chile", province: "Marga Marga", town: "Quilpué", street: "Calle 10" } } },
      ejemplo2: { value: { name: "Albedo", email: "albedo@gmail.com", address: { country: "Chile", province: "Marga Marga", town: "Quilpué", street: "Calle 20" } } },
    }
  })
  @ApiResponse({ status: 201, description: "Cliente agregado ok" })
  @ApiResponse({ status: 409, description: "El cliente o la dirección ya existe" })
  createClient(@Body() client: ClientDto)
  {
    return this.clientService.createClient(client);
  }

  @Get()
  @ApiOperation({ description: "Retorna todos los clientes y sus direcciones" })
  @ApiResponse({ status: 200, description: "Operación exitosa" })
  getAllClient()
  {
    return this.clientService.getAllClient();
  }

  @Get('/:id')
  @ApiOperation({ description: "Retorna un cliente por el id del cliente" })
  @ApiParam({ name: "id", type: Number, required: true, description: "Id del cliente" })
  @ApiResponse({ status: 200, description: "Operación exitosa" })
  @ApiResponse({ status: 409, description: "ERROR: el id del cliente no existe" })
  getClientById(@Param('id') id: number)
  {
    return this.clientService.getClientById(id);
  }

  @Put()
  @ApiOperation({ description: "Modifica un cliente" })
  @ApiBody({ description: "Modifica un cliente en base a ClientDto", type: ClientDto,
    examples: {
      ejemplo1: { value: { id: 1, name: "Qeqe", email: "qeqe@gmail.com", address: { id: 1, country: "Chile", province: "Marga Marga", town: "Quilpué", street: "Calle 10" }}},
      ejemplo2: { value: { id: 2, name: "Diona", email: "diona@gmail.com", address: { id: 2, country: "Chile", province: "Marga Marga", town: "Quilpué", street: "Calle 20" }}}
    }
 })
  @ApiResponse({ status: 200, description: "Operación exitosa" })
  @ApiResponse({ status: 409, description: `ERROR: <br/>El id o el email no fue recibido. <br/>El cliente o el email no existe. <br/>La dirección ya existe.` })
  updateCliente(@Body() clientDto: ClientDto)
  {
    return this.clientService.updateClient(clientDto);
  }

  @Delete('/:id')
  @ApiOperation({ description: "Elimina el registro de un cliente y su dirección." })
  @ApiParam({ name: "id", type: Number, required: true, description: "Id del cliente" })
  @ApiResponse({ status: 200, description: "Operación exitosa" })
  @ApiResponse({ status: 409, description: "ERROR: el id del cliente no existe" })
  deleteClienteById(@Param('id') id: number)
  {
    return this.clientService.deleteClientById(id);
  }
}
