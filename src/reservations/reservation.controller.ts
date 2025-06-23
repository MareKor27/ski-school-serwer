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
  UseGuards,
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
import { Actor } from 'src/commons/provider/actor.decorator';
import { UserData } from 'src/auth/type/auth';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/commons/middleware/roles-guard';
import { parseSort } from 'src/commons/servis/parseSort';
import { parseFilter } from 'src/commons/servis/parseFiltr';
import { Order, WhereOptions } from 'sequelize';
import { mapFilterToSequelizeWhere } from 'src/commons/servis/convertFilter';
import { FilterModel } from 'src/commons/types/FilterModel';
import { mapSortToSequelizeOrder } from 'src/commons/servis/convertSort';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async readReservations(
    @Query() query: PaginationQueryDto,
    @Actor() actor: UserData,
    //@Query('id') insctructorId: number | null,
  ): Promise<CollectionResponseDto<ReservationDto>> {
    const { page, size } = query;

    // console.log('query', query);
    const [reservations, totalRows] = await this.reservationService.findAll({
      actor,
      query,
    });

    const dto = reservations.map((reservation) =>
      mapReservationToDto(reservation),
    );

    return buildCollectionsResponseDto(dto, {
      page,
      size,
      totalRows,
    });
  }

  @Get('test')
  async testEndpoint(
    @Query('sort') sorts: string[] = [],
    @Query('filter') filters: string[] = [],
  ) {
    const sort = sorts.map(parseSort);
    const filter = filters.map(parseFilter);
    const nonNullFilters = filter.filter(
      (f): f is FilterModel<string> => f !== null,
    );

    const whereClause: WhereOptions = mapFilterToSequelizeWhere(nonNullFilters);
    // console.log(whereClause);
    const orderClause: Order = mapSortToSequelizeOrder(sort);
    // console.log(orderClause);

    // console.log(sort);
    // console.log(filter);

    return { sort, filter };
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
}
