import { User } from '../entities/user.entity';

export class UserResponseDto {
	constructor(
		public id: number,
		public name: string,
		public email: string,
	) {}

	static fromEntity(entity: User): UserResponseDto {
		return new UserResponseDto(entity.id, entity.name, entity.email);
	}
}
