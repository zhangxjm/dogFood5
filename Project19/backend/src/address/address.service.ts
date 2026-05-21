import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    if (createAddressDto.isDefault) {
      await this.addressRepository.update({}, { isDefault: false });
    }
    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({ order: { isDefault: 'DESC', createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('地址不存在');
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);
    if (updateAddressDto.isDefault) {
      await this.addressRepository.update({}, { isDefault: false });
    }
    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('地址不存在');
    }
  }

  async setDefault(id: string): Promise<Address> {
    await this.addressRepository.update({}, { isDefault: false });
    const address = await this.findOne(id);
    address.isDefault = true;
    return this.addressRepository.save(address);
  }
}
