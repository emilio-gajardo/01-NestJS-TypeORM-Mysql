import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Product } from './entity/product.entity';
import { ProductDto } from './dto/product-dto';
import { StockDto } from './dto/stock-dto';

@Injectable()
export class ProductService
{
  private MIN_STOCK = 0;
  private MAX_STOCK = 1000;

  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) { }

  async createProduct(productDto: ProductDto)
  {
    const productExist: ProductDto = await this.findProductById(productDto.id);

    if (!productExist || productDto.id === undefined)
    {
      return await this.productRepository.save(productDto);
    }

    else if (productExist)
    {
      throw new ConflictException('ERROR: El producto con id {' + productDto.id + '} ya existe');
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

  async updateProduct(productDto: ProductDto)
  {
    const productExist: ProductDto = await this.findProductById(productDto.id);
    if (productExist.id > 1)
    {
      return await this.productRepository.save(productDto);
    }
    else
    {
      throw new ConflictException('ERROR: El producto no existe');
    }
  }

  async softDelete(id: number)
  {
    const productExist: ProductDto = await this.findProductById(id);
    if (!productExist)
    {
      throw new ConflictException('ERROR: El producto con id {' + id + '} no existe');
    }
    if (productExist.deleted)
    {
      throw new ConflictException('ERROR: El producto con id {' + id + '} ya fue borrado');
    }

    const rows: UpdateResult = await this.productRepository.update({ id: id }, { deleted: true });

    return rows.affected == 1;
  }


  async restoreProduct(id: number)
  {
    const productExist: ProductDto = await this.findProductById(id);
    if (!productExist)
    {
      throw new ConflictException('ERROR: El producto con id {' + id + '} no existe');
    }
    if (!productExist.deleted)
    {
      throw new ConflictException('ERROR: El producto con id {' + id + '} no esta borrado');
    }

    const rows: UpdateResult = await this.productRepository.update(
      { id: id },
      { deleted: false }
    );

    return rows.affected == 1;
  }


  async updateStock(stockDto: StockDto)
  {
    const productDto: ProductDto = await this.findProductById(stockDto.id);

    if (!productDto)
    {
      throw new ConflictException('El producto con id ' + stockDto.id + ' no existe');
    }

    if (productDto.deleted)
    {
      throw new ConflictException('El producto con id ' + stockDto.id + ' ya esta eliminado');
    }

    if (productDto)
    {
      const rows: UpdateResult = await this.productRepository.update(
        { id: stockDto.id },
        { stock: stockDto.stock }
      );
      return rows.affected == 1;
    }
  }


  async addStock(stockDto: StockDto)
  {
    const productDto: ProductDto = await this.findProductById(stockDto.id);

    if (!productDto)
    {
      throw new ConflictException('ERROR: El producto con id <' + stockDto.id + '> no existe');
    }

    if (productDto.deleted)
    {
      throw new ConflictException('ERROR: El producto con id <' + stockDto.id + '> ya esta eliminado');
    }

    if (productDto)
    {
      let stockActual = productDto.stock;
      let stockAgregado = stockDto.stock;
      let newStock = (stockActual + stockAgregado);

      if (newStock > this.MAX_STOCK)
      {
        throw new ConflictException('ERROR: Stock ingresado fuera del rango. Stock máximo permitido = ' + this.MAX_STOCK);
      }

      else if (newStock <= this.MIN_STOCK)
      {
        throw new ConflictException('ERROR: Stock ingresado fuera del rango. Stock mínimo permitido = ' + this.MIN_STOCK);
      }

      else if (newStock <= this.MAX_STOCK && newStock >= this.MIN_STOCK)
      {
        const rows: UpdateResult = await this.productRepository.update(
          { id: stockDto.id },
          { stock: newStock }
        );
        return rows.affected == 1;
      }
    }
  }

  async reduceStock(stockDto: StockDto)
  {
    const productDto: ProductDto = await this.findProductById(stockDto.id);
    if (this.validadorPorductIdExist(stockDto.id))
    {
      let stockActual = productDto.stock;
      let stockRestado = stockDto.stock;
      let newStock = (stockActual - stockRestado);


      if (newStock > this.MAX_STOCK)
      {
        throw new ConflictException('ERROR: Stock ingresado esta fuera del rango. Stock máximo permitido = ' + this.MAX_STOCK);
      }

      else if (newStock < this.MIN_STOCK)
      {
        throw new ConflictException('ERROR: Stock ingresado esta fuera del rango. Stock mínimo permitido = ' + this.MIN_STOCK);
      }

      else if (newStock >= this.MIN_STOCK && newStock <= this.MAX_STOCK)
      {
        const rows: UpdateResult = await this.productRepository.update(
          { id: stockDto.id },
          { stock: newStock }
        );
        return rows.affected == 1;
      }
    }

  }

  async validadorPorductIdExist(id: number)
  {
    const productDto: ProductDto = await this.findProductById(id);
    if (!productDto)
    {
      throw new ConflictException('ERROR: El producto con id <' + id + '> no existe');
    }
    else if (productDto)
    {
      return true;
    }
  }
}
