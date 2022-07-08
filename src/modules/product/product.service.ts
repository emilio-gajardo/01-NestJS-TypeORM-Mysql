import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { ProductDto } from './dto/product-dto';

@Injectable()
export class ProductService
{

  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

  async createProduct(productDto: ProductDto)
  {
    const productExists: ProductDto = await this.findProductById(productDto.id);
    if (productExists)
    {
      throw new ConflictException('ERROR: El producto con id {' + productDto.id + '} ya existe');
    }
    else
    {
      return await this.productRepository.save(productDto);
    }
  }

  async findAllProducts()
  {
    return await this.productRepository.find({
      where: {
        deleted: false
      }
    });
  }

  async findAllProductsDeleted()
  {
    return await this.productRepository.find({
      where: {
        deleted: true
      }
    });
  }

  async findProductById(id: number)
  {
    return await this.productRepository.findOne({
      where: {
        id: id
      }
    });
  }
}
