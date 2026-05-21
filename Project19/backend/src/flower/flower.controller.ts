import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FlowerService } from './flower.service';
import { CreateFlowerDto } from './dto/create-flower.dto';
import { UpdateFlowerDto } from './dto/update-flower.dto';

@ApiTags('花束款式')
@Controller('flowers')
export class FlowerController {
  constructor(private readonly flowerService: FlowerService) {}

  @Post()
  @ApiOperation({ summary: '上架花束款式' })
  create(@Body() createFlowerDto: CreateFlowerDto) {
    return this.flowerService.create(createFlowerDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有花束款式' })
  findAll() {
    return this.flowerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个花束款式详情' })
  findOne(@Param('id') id: string) {
    return this.flowerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新花束款式信息' })
  update(@Param('id') id: string, @Body() updateFlowerDto: UpdateFlowerDto) {
    return this.flowerService.update(id, updateFlowerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除花束款式' })
  remove(@Param('id') id: string) {
    return this.flowerService.remove(id);
  }
}
