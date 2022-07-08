import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product-dto';

@Controller('api/v1/products')
@ApiTags('productos')
export class ProductController
{

  constructor(private productService: ProductService) { }

  @Post()
  createProduct(@Body() product: ProductDto)
  {
    return this.productService.createProduct(product);
  }

  @Get()
  getAllProducts()
  {
    return this.productService.findAllProducts();
  }

  @Get('/deleted')
  getAllProductsDeleted()
  {
    return this.productService.findAllProductsDeleted();
  }

  @Get('/:id')
  getProductById(@Param('id') id: number)
  {
    return this.productService.findProductById(id);
  }
}
