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
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Controller('rezerwacje')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.findOne(id);
  }

  @Get()
  findAll(
    @Query('client') idClient?: number,
    @Query('instructor') idInstructor?: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('day') day?: number,
    @Query('weekday') weekday?: number,
    @Query('hour') hour?: number,
  ) {
    return this.reservationService.findAll({
      idClient,
      idInstructor,
      year,
      month,
      day,
      weekday,
      hour,
    });
  }

  // Rozgraniczenie tego wyżej na jeszcze jeden end-point z samą datą w której było by to rozbite na
  // rok, miesiąc, dzień tygodnia, godzina

  @Post()
  createOne(@Body(ValidationPipe) createReservationDto: CreateReservationDto) {
    return this.reservationService.createOne(createReservationDto);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body(ValidationPipe) updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.updateOne(id, updateReservationDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.reservationService.deleteOne(+id);
  }
}
