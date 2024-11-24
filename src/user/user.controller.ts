import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { UserService } from './user.service';
import { User } from 'src/auth/schema/user.schema';

@Controller('users')
@UseGuards( RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

  

    // Get a user by ID
    @Get(':id')
    @Roles(Role.Admin)
    async getUserById(@Param('id') userId: string): Promise<User> {
        return this.userService.findOne(userId);
    }

    // Get all users
    @Get()
    @Roles(Role.Admin)
    async getAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    // Update a user
    @Put(':id')
    @Roles(Role.Admin, Role.User)
    async updateUser(
        @Param('id') userId: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(userId, updateUserDto);
    }

    // Delete a user by ID
    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id') userId: string): Promise<void> {
        await this.userService.delete(userId);
    }

    // Delete all users (For admin usage, e.g., for cleanup purposes)
    @Delete()
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllUsers(): Promise<void> {
        await this.userService.deleteAll();
    }
}
