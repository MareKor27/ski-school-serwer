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
  UseGuards,
} from '@nestjs/common';

import { ReservationService } from './reservation.service';
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
import * as nodemailer from 'nodemailer';
import { ReservationModel } from './models/reservation.model';
import { AuthService } from 'src/auth/auth.service';
import { Audit } from 'src/audit/audit-log.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async readReservations(
    @Query() query: PaginationQueryDto,
    @Actor() actor: UserData,
    //@Query('id') insctructorId: number | null,
  ): Promise<CollectionResponseDto<ReservationDto>> {
    const { page, size } = query;

    // console.log('query', query);
    const [reservation, totalRows] = await this.reservationService.findAll({
      actor,
      query,
    });

    const dto = reservation.map((reservation) =>
      mapReservationToDto(reservation),
    );

    return buildCollectionsResponseDto(dto, {
      page,
      size,
      totalRows,
    });
  }

  // @Get('test')
  // async testEndpoint(
  //   @Query('sort') sorts: string[] = [],
  //   @Query('filter') filters: string[] = [],
  // ) {
  //   const sort = sorts.map(parseSort);
  //   const filter = filters.map(parseFilter);
  //   const nonNullFilters = filter.filter(
  //     (f): f is FilterModel<string> => f !== null,
  //   );

  //   const whereClause: WhereOptions = mapFilterToSequelizeWhere(nonNullFilters);
  //   // console.log(whereClause);
  //   const orderClause: Order = mapSortToSequelizeOrder(sort);
  //   // console.log(orderClause);

  //   // console.log(sort);
  //   // console.log(filter);

  //   return { sort, filter };
  // }

  // @UsePipes(
  //   new ValidationPipe({
  //     exceptionFactory: (errors) => new BadRequestException(errors),
  //   }),
  // )
  @Post()
  @Audit('RESERVATION-CREATE')
  async createReservation(@Body() reservationBodyDto: ReservationBodyDto) {
    const reservation =
      await this.reservationService.createOne(reservationBodyDto);
    let stringAppointments = '';
    reservationBodyDto.filteredReservationAppoitmentsIds.map((id) => {
      stringAppointments += ` ${id} `;
    });

    const message = `Reservations successfully create with appointments:${stringAppointments}`;

    const reservationWithAllData = await this.reservationService.findOne(
      reservation.id,
    );
    if (reservationWithAllData != null) {
      const reservationToken = await this.authService.reservationToken(
        reservationWithAllData,
      );
      await this.sendEmail(reservationWithAllData, reservationToken);
    }

    return buildResponseDto(reservation, message);
  }

  async sendEmail(reservation: ReservationModel, token: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const url = `http://localhost:5173/administrator/weryfikacja/${token}`;

    const htmlContent = `
<h1 style="font-family: Arial, sans-serif;">Witaj!</h1>
<h2 style="font-family: Arial, sans-serif;">Została stworzona rezerwacja na:</h2>
<p style="font-family: Arial, sans-serif;">Kliknij poniższy link, aby potwierdzić rezerwację:</p>
<p><a href="${url}" style="font-family: Arial, sans-serif; color: #1a73e8;">${url}</a></p>
<hr style="margin: 20px 0;" />
<h3 style="font-family: Arial, sans-serif;">Dane rezerwacji:</h3>
<table cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; width: 100%; max-width: 600px;">
  <thead>
    <tr style="background-color: #f2f2f2;">
      <th style="border: 1px solid #ddd; text-align: left;">Pole</th>
      <th style="border: 1px solid #ddd; text-align: left;">Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="border: 1px solid #ddd;">ID</td><td style="border: 1px solid #ddd;">${reservation.id}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Data rezerwacji</td><td style="border: 1px solid #ddd;">${reservation.appointments[0].appointmentDate.toLocaleDateString(
      'pl-PL',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      },
    )}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Imię i nazwisko</td><td style="border: 1px solid #ddd;">${reservation.fullName}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Email</td><td style="border: 1px solid #ddd;">${reservation.email}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Numer telefonu</td><td style="border: 1px solid #ddd;">${reservation.phoneNumber}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Wykupiony czas (godziny)</td><td style="border: 1px solid #ddd;">${reservation.purchasedTime}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Liczba uczestników</td><td style="border: 1px solid #ddd;">${reservation.participants}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Wiek uczestników</td><td style="border: 1px solid #ddd;">${reservation.ageOfParticipants}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Poziom zaawansowania</td><td style="border: 1px solid #ddd;">${reservation.advancement}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Wybrane wyposażenie</td><td style="border: 1px solid #ddd;">${reservation.chosenEquipment}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Dodatkowe uwagi</td><td style="border: 1px solid #ddd;">${reservation.additionalComments || '---'}</td></tr>
    <tr><td style="border: 1px solid #ddd;">Informacje o ubezpieczeniu</td><td style="border: 1px solid #ddd;">${reservation.insuranceInformation || '---'}</td></tr>
  </tbody>
</table>`;

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: reservation.email,
      subject: `FigowskiSport - Potwierdzenie rezerwacji #${reservation.id}`,
      html: htmlContent,
    });
  }

  @Patch(':id')
  async updateReservation(
    @Param('id') id: number,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const reservation = await this.reservationService.updateOne(
      id,
      updateReservationDto,
    );
    const message = `Reservations with id:${reservation.id} successfully update`;
    return buildResponseDto(reservation, message);
  }

  @Delete(':id')
  @Audit('RESERVATION-DELETE')
  async deleteReservation(@Param('id') id: number) {
    const reservation = await this.reservationService.deleteOne(+id);
    const message = ``; //Reservations with id:${reservation.id} successfully delate`;
    return buildResponseDto(reservation, message);
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
