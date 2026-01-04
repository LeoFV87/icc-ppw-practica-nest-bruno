import { Injectable } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

import { NotFoundException } from 'src/exceptions/domain/not-found.exception';
import { ConflictException } from 'src/exceptions/domain/conflict.exception';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Obtener todos los usuarios (enfoque funcional)
   */
  async findAll(): Promise<UserResponseDto[]> {
    // 1. Repository → Entities
    const entities = await this.userRepository.find();

    // 2. Entities → Domain Models → DTOs (programación funcional)
    return entities
      .map(User.fromEntity)
      .map(user => user.toResponseDto());
  }

  /**
   * Obtener un usuario por ID (enfoque funcional con manejo de errores)
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      // Usamos tu nueva NotFoundException
      throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);
    }

    return User.fromEntity(entity).toResponseDto();
  }

  async create(dto: CreateUserDto) {
    const exists = await this.userRepository.exist({ where: { email: dto.email } });
    
    if (exists) {
      // Cambiamos a ConflictException porque el email ya existe
      throw new ConflictException(`El email ${dto.email} ya está registrado`);
    }

    const user = User.fromDto(dto);
    const saved = await this.userRepository.save(user.toEntity());
    
    return User.fromEntity(saved).toResponseDto();
  }

  /**
   * Actualizar usuario completo (PUT)
   */
  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);
    }

    const updated = User.fromEntity(entity)
      .update(dto)
      .toEntity();

    const saved = await this.userRepository.save(updated);
    
    return User.fromEntity(saved).toResponseDto();
  }

  /**
   * Actualizar parcialmente (PATCH)
   */
  async partialUpdate(id: number, dto: PartialUpdateUserDto): Promise<UserResponseDto> {
    const entity = await this.userRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Usuario no encontrado con ID: ${id}`);
    }

    const updated = User.fromEntity(entity)
      .partialUpdate(dto)
      .toEntity();

    const saved = await this.userRepository.save(updated);
    
    return User.fromEntity(saved).toResponseDto();
  }

  /**
   * Eliminar usuario
   */
  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      // También aquí usamos la personalizada
      throw new NotFoundException(`No se pudo eliminar: Usuario no encontrado con ID: ${id}`);
    }
  }
}