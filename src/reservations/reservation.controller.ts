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
  Res,
  ValidationPipe,
} from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { UserModel } from 'src/users/models/user.model';
import { ReservationDto } from './dto/reservation.dto';
import { mapReservationToDto } from './dto/reservation.dto.mapper';
import { ResponseDto } from 'src/commons/dto/response.dto';
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';
import { buildCollectionsResponseDto } from 'src/commons/dto/collectionsResponse.dto.mapper';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get(':id')
  async getReservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<ReservationDto>> {
    const reservation = await this.reservationService.findOne(id);
    if (!reservation)
      throw new NotFoundException(`Reservation with id ${id} not found`);
    const dto = mapReservationToDto(reservation);
    return buildResponseDto(dto);
  }

  @Get()
  async readReservations(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    // @Query('participants') participants?: number,
    // @Query('advancement') advancement?: string,
    // @Query('chosenEquipment') chosenEquipment?: string,
  ): Promise<CollectionResponseDto<ReservationDto>> {
    const [reservations, totalRows] = await this.reservationService.findAll(
      page,
      size,
    );
    const dto = reservations.map(mapReservationToDto);
    return buildCollectionsResponseDto(dto, { page, size, totalRows });
  }

  @Post()
  createReservation(
    @Body(ValidationPipe) createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.createOne(createReservationDto);
  }

  @Patch(':id')
  updateReservation(
    @Param('id') id: number,
    @Body(ValidationPipe) updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.updateOne(id, updateReservationDto);
  }

  @Delete(':id')
  deleteReservation(@Param('id') id: number) {
    return this.reservationService.deleteOne(+id);
  }
}
