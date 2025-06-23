import {
  BadRequestException,
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
  Request,
  UseGuards,
  UsePipes,
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
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/commons/middleware/roles-guard';
import { PaginationQueryDto } from 'src/commons/dto/paginationQueryDto.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<UserDto>> {
    const user = await this.userService.findOneUser(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    const dto = mapUserToDto(user);
    return buildResponseDto(dto);
  }

  @Get()
  @Roles('ADMIN', 'INSTRUCTOR')
  async readUsers(
    @Query() queryPagination: PaginationQueryDto,
    @Query('role') role?: Role,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ): Promise<CollectionResponseDto<UserDto>> {
    const { page, size } = queryPagination;

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
  }

  @Post()
  @Roles('ADMIN', 'INSTRUCTOR')
  async createUser(@Body() userData: CreateUserDto) {
    const user = await this.userService.create(userData);
    const message = `User with id:${user.id} successfully created`;
    return buildResponseDto(user, message);
  }

  @Patch(':id')
  @Roles('ADMIN', 'INSTRUCTOR')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateOne(id, updateUserDto);
    const message = `User with id:${user.id} successfully updated`;
    return buildResponseDto(user, message);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteUser(@Param('id') id: number): Promise<ResponseDto<UserDto>> {
    const user = await this.userService.delete(id);
    const message = `User with id:${user.id} successfully deleted`;
    return buildResponseDto(user, message);
  }
}
