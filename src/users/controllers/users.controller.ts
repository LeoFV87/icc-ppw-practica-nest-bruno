import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';
import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('usuarios')
export class UsersController {
  private users: Array<User> = [];
  private currentId = 1;

  @Get()
  findAll() {
    return this.users.map((u) => UserMapper.toResponseDto(u));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) return { error: 'User not found' };

    return UserMapper.toResponseDto(user);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    const entity = UserMapper.toEntity(this.currentId++, dto);
    this.users.push(entity);
    return UserMapper.toResponseDto(entity);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateUserDto) {
    const user = this.users.find((u) => u.id === Number(id));
    if (!user) return { error: 'User not found' };

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;

    return UserMapper.toResponseDto(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const exists = this.users.some((u) => u.id === Number(id));
    if (!exists) return { error: 'User not found' };

    this.users = this.users.filter((u) => u.id !== Number(id));
    return { message: 'Deleted successfully' };
  }
}
