import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PartialUpdateUserDto } from '../dtos/partial-update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date,
  ) {}

  // ==================== FACTORY METHODS ====================

  /**
   * Crea un User desde un DTO de creación
   */
  static fromDto(dto: CreateUserDto): User {
    return new User(
      0, // El ID se asignará automáticamente en la BD
      dto.name,
      dto.email,
      dto.password,
      new Date(),
    );
  }

  /**
   * Crea un User desde una entidad persistente de TypeORM
   */
  static fromEntity(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.createdAt,
    );
  }

  // ==================== CONVERSION METHODS ====================

  /**
   * Convierte este modelo de dominio a una entidad persistente (UserEntity)
   */
  toEntity(): UserEntity {
    const entity = new UserEntity();
    if (this.id > 0) {
      entity.id = this.id;
    }
    entity.name = this.name;
    entity.email = this.email;
    entity.password = this.password;
    // Se mantiene la fecha de creación original
    entity.createdAt = this.createdAt;
    return entity;
  }

  /**
   * Convierte este User a un DTO de respuesta para el cliente
   */
  toResponseDto(): UserResponseDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt instanceof Date 
        ? this.createdAt.toISOString() 
        : new Date(this.createdAt).toISOString(),
    };
    // Nota: El campo 'password' se omite por seguridad
  }

  // ==================== UPDATE METHODS ====================

  /**
   * Aplica una actualización completa de los datos
   */
  update(dto: UpdateUserDto): User {
    this.name = dto.name ?? this.name;
    this.email = dto.email ?? this.email;
    
    if (dto.password) {
      this.password = dto.password;
    }
    return this;
  }

  /**
   * Aplica una actualización parcial (solo campos presentes en el DTO)
   */
  partialUpdate(dto: PartialUpdateUserDto): User {
    // En actualizaciones parciales, validamos explícitamente contra undefined
    if (dto.name !== undefined) {
      this.name = dto.name;
    }
    if (dto.email !== undefined) {
      this.email = dto.email;
    }
    if (dto.password !== undefined) {
      this.password = dto.password;
    }
    return this;
  }
}