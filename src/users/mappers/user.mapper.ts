import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toEntity(dto: CreateUserDto): UserEntity {
    const entity = new UserEntity();
    entity.name = dto.name;
    entity.email = dto.email;
    entity.password = dto.password;
    return entity;
  }

  static toResponseDto(user: UserEntity) {
   return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(), 
    };
  }
}
