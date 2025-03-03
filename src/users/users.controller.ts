import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';
import { ResponseDto } from 'src/commons/dto/response.dto';
import { buildCollectionsResponseDto } from 'src/commons/dto/collectionsResponse.dto.mapper';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<UserDto>> {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const dto = mapUserToDto(user);
    return buildResponseDto(dto);
  }

  @Get()
  async readUsers(
    @Query('role') role?: Role,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const [users, totalRows] = await this.userService.findAll(
      {
        role,
        name,
        email,
        phone,
      },
      page,
      size,
    );
    const dto = users.map(mapUserToDto);
    return buildCollectionsResponseDto(dto, { page, size, totalRows });
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
