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
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { ReservationBodyDto, ReservationDto } from './dto/reservation.dto';
import { mapReservationToDto } from './dto/reservation.dto.mapper';
import { ResponseDto } from 'src/commons/dto/response.dto';
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';
import { buildCollectionsResponseDto } from 'src/commons/dto/collectionsResponse.dto.mapper';
import { PaginationQueryDto } from '../commons/dto/paginationQueryDto.dto';

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
    @Query() query: PaginationQueryDto,
  ): Promise<CollectionResponseDto<ReservationDto>> {
    const { page, size } = query;

    const [reservations, totalRows] = await this.reservationService.findAll(
      page,
      size,
    );
    const dto = reservations.map(mapReservationToDto);
    return buildCollectionsResponseDto(dto, {
      page,
      size,
      totalRows,
    });
  }

  // @UsePipes(
  //   new ValidationPipe({
  //     exceptionFactory: (errors) => new BadRequestException(errors),
  //   }),
  // )
  @Post()
  async createReservation(@Body() reservationBodyDto: ReservationBodyDto) {
    const reservations =
      await this.reservationService.createOne(reservationBodyDto);
    let stringAppointments = '';
    reservationBodyDto.filteredReservationAppoitmentsIds.map((id) => {
      stringAppointments += ` ${id} `;
    });

    const message = `Reservations successfully create with appointments:${stringAppointments}`;
    return buildResponseDto(reservations, message);
  }

  @Patch(':id')
  async updateReservation(
    @Param('id') id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const reservations = await this.reservationService.updateOne(
      id,
      updateReservationDto,
    );
    const message = `Reservations with id:${reservations.id} successfully update`;
    return buildResponseDto(reservations, message);
  }

  @Delete(':id')
  async deleteReservation(@Param('id') id: number) {
    const reservations = await this.reservationService.deleteOne(+id);
    const message = ``; //Reservations with id:${reservations.id} successfully delate`;
    return buildResponseDto(reservations, message);
  }
}
