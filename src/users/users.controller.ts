import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Role } from './types/role';
import { UserModel } from './models/user.model';
import { UserDto } from './dto/user.dto';
import { mapUserToDto } from './dto/user.dto.mapper';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.userService.findOne(id);
    const dto = mapUserToDto(user);
    return dto;
  }

  @Get()
  readUsers(
    @Query('role') role?: Role,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    return this.userService.findAll({ role, name, email, phone: phone });
  } //TTTTUTUTUTUTUTUTUTUTTAAAAAAJJAJAJAAJAJAJAJAJAJA

  @Post()
  createUser(@Body(ValidationPipe) userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
