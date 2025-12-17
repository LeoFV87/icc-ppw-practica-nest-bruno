import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UserMapper } from "../mappers/user.mapper";
import { User } from "../entities/user.entity";
import CreateUserDto from "../dtos/create-user.dto";
import PartialUpdateUserDto from "../dtos/partial-update-user.dto";

@Controller('users')
export class UsersController {

    private users: User[] = [];
    currentId: any;

    @Get()
    findAll() {
        return this.users.map(user => UserMapper.toResponse(user));
    }


    findOne(@Param('id') id: string) {
        const user = this.users.find(u => u.id === parseInt(id));
        if (user) {
            return UserMapper.toResponse(user);
        }
        return null;
    }


    @Post()
    create(@Body() dto: CreateUserDto) {
        const entity = UserMapper.toEntity(this.currentId++, dto);
        this.users.push(entity);
        return UserMapper.toResponse(entity);

    }

    @Patch(':id')
    partialUpdate(@Param('id') id: string, @Body() dto: PartialUpdateUserDto) {
        const user = this.users.find(u => u.id === Number(id));
        if (user) {
            if (dto.name !== undefined) {
                user.name = dto.name;
            }
            if (dto.email !== undefined) {
                user.email = dto.email;
            }
            if (dto.password !== undefined) {
                user.password = dto.password;
            }
            return UserMapper.toResponse(user);
        }

    }
}