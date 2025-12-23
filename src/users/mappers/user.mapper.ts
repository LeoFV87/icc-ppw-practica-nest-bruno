import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toEntity(id: number, dto: CreateUserDto): User {
    return new User(id, dto.name, dto.email, dto.password);
  }

  static toResponseDto(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
}
