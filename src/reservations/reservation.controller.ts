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

import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { UserModel } from 'src/users/models/user.model';
import { ReservationDto } from './dto/reservation.dto';
import { mapReservationToDto } from './dto/reservation.dto.mapper';
import { ResponseDto } from 'src/commons/dto/response.dto';
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get(':id')
  async getReservation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<ReservationDto>> {
    const reservation = await this.reservationService.findOne(id);
    const dto = mapReservationToDto(reservation);
    return buildResponseDto(dto);
  }

  @Get()
  readReservations(
    @Query('page') page?: number,
    @Query('size') size?: number,
    // @Query('participants') participants?: number,
    // @Query('advancement') advancement?: string,
    // @Query('chosenEquipment') chosenEquipment?: string,
  ): Promise<CollectionResponseDto<ReservationDto>> {
    return this.reservationService.findAll(page, size);
  }

  // // Rozgraniczenie tego wyżej na jeszcze jeden end-point z samą datą w której było by to rozbite na
  // // rok, miesiąc, dzień tygodnia, godzina

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
