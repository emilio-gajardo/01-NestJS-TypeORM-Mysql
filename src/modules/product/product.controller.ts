import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Controller('api/v1/products')
@ApiTags('productos')
export class ProductController
{

  constructor(private productService: ProductService) { }

  @Post()
  @ApiOperation({ description: "Crea un producto" })
  @ApiBody({
    description: "Crea un producto usando la clase ProducDto",
    type: ProductDto,
    examples: {
      Ejemplo1: { value: { "id": 1, "name": "Producto 1", "price": 100, "stock": 10 } },
      Ejemplo2: { value: { "name": "Producto 2", "price": 200, "stock": 20 } }
    }
  })
  @ApiResponse({ status: 201, description: "Registro agregado exitosamente" })
  @ApiResponse({ status: 409, description: "ERROR: Registro ya existe" })
  createProduct(@Body() product: ProductDto)
  {
    return this.productService.createProduct(product);
  }

  @Get()
  @ApiOperation({ description: "Muestra todos los productos con estado disponible" })
  @ApiResponse({ status: 200, description: "Petición retorna los registros OK" })
  getAllProducts()
  {
    return this.productService.findAllProducts();
  }

  @Get('/deleted')
  @ApiOperation({ description: "Muestra todos los productos con estado eliminado" })
  @ApiResponse({ status: 200, description: "Petición retorna los registros OK" })
  getAllProductsDeleted()
  {
    return this.productService.findAllProductsDeleted();
  }

  @Get('/:id')
  @ApiOperation({ description: "Muestra un producto en base al id entregado" })
  @ApiParam({ name: "id", description: "Id del producto", required: true, type: Number })
  @ApiResponse({ status: 200, description: "Petición retorna el registro OK"})
  getProductById(@Param('id') id: number)
  {
    return this.productService.findProductById(id);
  }

  @Put()
  @ApiOperation({ description: "Actualiza un producto en base a la clase ProductDto" })
  @ApiBody({
    description: "Actualiza un producto",
    type: ProductDto,
    examples: {
      Ejemplo1: { value: { "id": 1, "name": "Producto1.1", "price": 101, "stock": 11 } },
      Ejemplo2: { value: { "id": 2, "name": "Producto2.2", "price": 202, "stock": 22 } }
    }
  })
  @ApiResponse({ status: 200, description: "Petición actualiza registro OK" })
  updateProduct(@Body() productDto: ProductDto)
  {
    return this.productService.updateProduct(productDto);
  }


  @Delete('/:id')
  @ApiOperation({ description: "Eliminación lógica de un producto en base a su id" })
  @ApiParam({ name: "id", description: "Id del producto", required: true, type: Number })
  @ApiResponse({ status: 200, description: "Petición elimina registro OK" })
  @ApiResponse({ status: 409, description: `El registro no existe<br/>El registro ya esta eliminado` })
  deleteProduct(@Param('id') id: number)
  {
    return this.productService.softDelete(id);
  }


  @Patch('/restore/:id')
  @ApiOperation({ description: "Restaura el estado de producto a disponible, en base a su id" })
  @ApiParam({ name: "id", description: "Id del producto", required: true, type: Number })
  @ApiResponse({ status: 200, description: "Habilita la disponibilidad del registro" })
  @ApiResponse({ status: 409, description: `El registro no existe<br/>El registro no esta eliminado` })
  restoreProduct(@Param('id') id: number)
  {
    return this.productService.restoreProduct(id);
  }

  @Patch('/stock')
  @ApiOperation({ description: "Actualiza el stock de un producto" })
  @ApiBody({
    description: "Actualiza el stock de un producto",
    type: StockDto,
    examples: {
      Ejemplo1: { value: { "id": 1, "stock": 111 } },
      Ejemplo2: { value: { "id": 2, "stock": 222 } }
    }
  })
  @ApiResponse({ status: 200, description: "El stock del registro fue actualizado OK" })
  @ApiResponse({ status: 409, description: `El registro no existe<br/>El registro ya esta eliminado` })
  updateStock(@Body() stock: StockDto)
  {
    return this.productService.updateStock(stock);
  }

  @Patch('/add-stock')
  @ApiOperation({ description: "Agrega stock a un producto" })
  @ApiBody({
    description: "Agrega stock a un producto",
    type: StockDto,
    examples: {
      Ejemplo1: { value: { "id": 1, "stock": 11 } },
      Ejemplo2: { value: { "id": 2, "stock": 22 } }
    }
  })
  @ApiResponse({ status: 200, description: "El stock del registro fue agregado OK" })
  @ApiResponse({ status: 409, description: `El registro no existe<br/>El registro ya esta eliminado` })
  addStock(@Body() stockDto: StockDto)
  {
    return this.productService.addStock(stockDto);
  }

  @Patch('/reduce-stock')
  @ApiOperation({ description: "Reduce el stock de un producto" })
  @ApiBody({
    description: "Reduce el stock de un producto",
    type: StockDto,
    examples: {
      Ejemplo1: { value: { "id": 1, "stock": 1 } },
      Ejemplo2: { value: { "id": 1, "stock": 2 } }
    }
  })
  @ApiResponse({ status: 200, description: "El stock del registro fue reducido OK" })
  @ApiResponse({ status: 409, description: `El registro no existe<br/>El registro ya esta eliminado` })
  reduceStock(@Body() stockDto: StockDto)
  {
    return this.productService.reduceStock(stockDto);
  }
}
