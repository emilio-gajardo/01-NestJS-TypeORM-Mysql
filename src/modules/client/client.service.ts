import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientDto } from './dto/client-dto';

import { Client } from './entity/client.entity';
import { Address } from './entity/address.entity';
import { AddressDto } from './dto/address-dto';
import { response } from 'express';

@Injectable()
export class ClientService
{
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Address) private addressRepository: Repository<Address>
  ) { }

  async createClient(clientDto: ClientDto)
  {
    const clientExist = await this.findClient(clientDto);
    if (clientExist)
    {
      if (clientDto.id)
      {
        throw new ConflictException('El id <' + clientDto.id + '> ya existe');
      }
      if (clientDto.email)
      {
        throw new ConflictException('El email <' + clientDto.email + '> ya existe');
      }
    }

    let addressExists: Address = null;
    if (clientDto.address.id)
    {
      addressExists = await this.addressRepository.findOne({
        where: { id: clientDto.address.id }
      });
    } else
    {
      addressExists = await this.addressRepository.findOne({
        where: {
          country: clientDto.address.country,
          province: clientDto.address.province,
          town: clientDto.address.town,
          street: clientDto.address.street
        }
      });
    }

    if (addressExists)
    {
      throw new ConflictException('La dirección ya existe');
    }

    if (!clientExist && !addressExists)
    {
      return this.clientRepository.save(clientDto);
    }
  }


  async findClient(clientDto: ClientDto)
  {
    return await this.clientRepository.findOne({
      where: [
        { id: clientDto.id },
        { email: clientDto.email }
      ]
    });
  }

  async getAllClient()
  {
    return this.clientRepository.find();
  }


  async getClientById(id: number)
  {
    return this.clientRepository.findOne({
      where: { id: id }
    });
  }

  async updateClient(clientDto: ClientDto)
  {

    if (!clientDto.id) 
    {
      throw new ConflictException("ERROR: El 'id' no fue recibido");
    }
    if (!clientDto.email)
    {
      throw new ConflictException("ERROR: el 'email' no fue recibido");
    }

    let clientExistById: ClientDto = await this.findClientById(clientDto.id);
    let clientExistByEmail: ClientDto = await this.findClientByEmail(clientDto.email);

    if (!clientExistById)
    {
      throw new ConflictException("ERROR: El cliente con id '" + clientDto.id + "' no existe");
    }

    if (clientExistById)
    {
      if (clientExistByEmail.id != clientDto.id) 
      {
        throw new ConflictException("ERROR: El cliente con el email '" + clientDto.email + "' ya existe");
      }

      clientExistById = await this.getClientById(clientDto.id);
      let addressExists: Address = null;
      let deleteAddress = false;

      if (clientDto.address.id)
      {
        addressExists = await this.findAddressById(clientDto.address.id);
      }

      if (addressExists && addressExists.id != clientExistById.address.id)
      {
        throw new ConflictException("ERROR: La dirección ya existe");
      }
      else if (JSON.stringify(addressExists) != JSON.stringify(clientDto.address))
      {
        addressExists = await this.findAddress(clientDto);
        if (addressExists)
        {
          throw new ConflictException("ERROR: La dirección ya existe");
        }
        else
        {
          deleteAddress = true;
        }
      }
      const updateClient = await this.clientRepository.save(clientDto);
      if (deleteAddress)
      {
        await this.addressRepository.delete({ id: clientExistById.address.id });
      }
      return updateClient;
    }
  }


  async findClientById(id: number)
  {
    return await this.clientRepository.findOne({
      where: { id: id }
    });
  }

  async findClientByEmail(email: string)
  {
    return await this.clientRepository.findOne({
      where: { email: email }
    });
  }

  async findAddress(clientDto: ClientDto)
  {
    return await this.addressRepository.findOne({
      where: {
        country: clientDto.address.country,
        province: clientDto.address.province,
        town: clientDto.address.town,
        street: clientDto.address.street
      }
    });
  }

  async findAddressById(id: number)
  {
    return await this.addressRepository.findOne({
      where: { id: id }
    });
  }


  async deleteClientById(id: number)
  {
    let res = "";
    let clientExist = await this.findClientById(id);

    if (clientExist)
    {
      let rowClient = await this.clientRepository.delete({ id: id });

      if (rowClient.affected == 1)
      {
        let rowAddress = await this.addressRepository.delete({ id: clientExist.address.id });
        if (rowAddress.affected == 1)
        {
          res = "Dirección eliminada OK.";
        }
        else if (rowAddress.affected != 1)
        {
          throw new ConflictException("ERROR: No se a podido eliminar la dirección");
        }
        res = "Cliente eliminado OK. " + res;
      }

      else if (rowClient.affected != 1)
      {
        throw new ConflictException("ERROR: No se a podido eliminar al cliente");
      }
    }

    if (!clientExist)
    {
      throw new ConflictException("ERROR: Cliente con id '" + id + "' no existe");
    }

    return res;
  }

}
