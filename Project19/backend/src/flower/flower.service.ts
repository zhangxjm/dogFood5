import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flower } from './flower.entity';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';

@Injectable()
export class FlowerService {
  constructor(
    @InjectRepository(Flower)
    private flowerRepository: Repository<Flower>,
  ) {}

  async create(createFlowerDto: CreateFlowerDto): Promise<Flower> {
    const flower = this.flowerRepository.create(createFlowerDto);
    return this.flowerRepository.save(flower);
  }

  async findAll(): Promise<Flower[]> {
    return this.flowerRepository.find({ where: { isAvailable: true } });
  }

  async findOne(id: string): Promise<Flower> {
    const flower = await this.flowerRepository.findOne({ where: { id } });
    if (!flower) {
      throw new NotFoundException('花束款式不存在');
    }
    return flower;
  }

  async update(id: string, updateFlowerDto: UpdateFlowerDto): Promise<Flower> {
    const flower = await this.findOne(id);
    Object.assign(flower, updateFlowerDto);
    return this.flowerRepository.save(flower);
  }

  async remove(id: string): Promise<void> {
    const result = await this.flowerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('花束款式不存在');
    }
  }
}
