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

@Controller('uzytkownicy')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  findAll(
    @Query('role') role?: Role,
    @Query('name') nameSurname?: string,
    @Query('email') email?: string,
    @Query('phone') phoneNumber?: string,
  ) {
    return this.userService.findAll({ role, nameSurname, email, phoneNumber });
  }

  @Post()
  createOne(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.userService.deleteOne(+id);
  }
}
