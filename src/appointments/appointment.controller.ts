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
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { mapAppointmentToDto } from './dto/appointment.dto.mapper';
import { buildResponseDto } from 'src/commons/dto/response.dto.mapper';
import { ResponseDto } from 'src/commons/dto/response.dto';
import { buildCollectionsResponseDto } from 'src/commons/dto/collectionsResponse.dto.mapper';
import { CollectionResponseDto } from 'src/commons/dto/collectionResponse.dto';
import { ReservationDto } from 'src/reservations/dto/reservation.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/commons/middleware/roles-guard';
import { Actor } from 'src/commons/provider/actor.decorator';
import { UserDto } from 'src/users/dto/user.dto';
import { UserData } from 'src/auth/type/auth';
import { AppointmentRequestBody } from './dto/appointmentRequestBody.dto';
import { Audit } from 'src/audit/audit-log.decorator';
import { AuditEvent } from 'src/audit/profiles/audit-body-profile.enum';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get(':id')
  async getAppointment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<AppointmentDto>> {
    const appointment = await this.appointmentService.findAppointmentById(id);
    if (!appointment)
      throw new NotFoundException(`Reservation with id ${id} not found`);
    const dto = mapAppointmentToDto(appointment);
    return buildResponseDto(dto);
  }

  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('between/:start/:end')
  async readAppointmentsBetweenDates(
    @Param('start') startDate: string,
    @Param('end') endDate: string,
    @Query('user') instructorId?: number,
  ): Promise<ResponseDto<AppointmentDto[]>> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const appointments =
      await this.appointmentService.findAppointmentsBetweenDates(start, end, {
        instructorId,
      });

    // console.log('appoitments', appointments.length);
    const dto = appointments.map((appointment) =>
      mapAppointmentToDto(appointment, { include: { reservation: false } }),
    );
    console.log('appoitments');
    return buildResponseDto(dto);
  }

  @Get('data/:data/:hour')
  async readAppointmentsForReservation(
    @Param('data') data: Date,
    @Param('hour') hour: number,
  ): Promise<ResponseDto<AppointmentDto[]>> {
    const reservationDate = new Date(data);

    const appointments =
      await this.appointmentService.findAppointmentsForReservation(
        reservationDate,
        hour,
      );
    const dto = appointments.map((appointment) =>
      mapAppointmentToDto(appointment),
    );
    return buildResponseDto(dto);
  }

  @Get()
  async readAppointments(
    @Query('instruktor') idInstructor?: number,
    @Query('date') appointmentDate?: Date,
    @Query('dostepne') available?: boolean,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<CollectionResponseDto<AppointmentDto>> {
    const [appointments, totalRows] = await this.appointmentService.findAll(
      {
        idInstructor,
        appointmentDate,
        available,
      },
      page,
      size,
    );
    const dto = appointments.map((appointment) =>
      mapAppointmentToDto(appointment),
    );

    return buildCollectionsResponseDto(dto, { page, size, totalRows });
  }

  @Post('/instructor/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Audit(AuditEvent.APPO_ADM_MODIFIES_USERS)
  async createAppointmentForInstructor(
    @Body() createAvailabilityDto: CreateAppointmentDto,
    @Param('id') id: number,
  ) {
    const app = await this.appointmentService.createAppointment(
      id,
      createAvailabilityDto.appointmentDate,
    );

    const appointment = await this.appointmentService.findAppointmentById(
      app.id,
    );

    if (!appointment)
      throw new NotFoundException(`Reservation with id ${id} not found`);
    const message = `Appointment successfully created`;

    return buildResponseDto(appointment, message);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Audit(AuditEvent.APPO_INS_MODIFIES)
  async createAppointment(
    @Body() createAvailabilityDto: CreateAppointmentDto,
    @Actor() user: UserData,
  ) {
    const app = await this.appointmentService.createAppointment(
      user.id,
      createAvailabilityDto.appointmentDate,
    );
    const appointment = await this.appointmentService.findAppointmentById(
      app.id,
    );

    if (!appointment)
      throw new NotFoundException(`Appointment with id ${app.id} not found`);
    const message = `Appointment successfully created`;
    return buildResponseDto(appointment, message);
  }

  @Patch(':id')
  @Audit(AuditEvent.APPO_PATCH)
  async updateAppointment(
    @Param('id') id: number,
    @Body() updateAvailabilityDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.appointmentService.updateOne(
      id,
      updateAvailabilityDto,
    );
    const message = `Appointment with id:${appointment.id} successfully updated`;

    return buildResponseDto(appointment, message);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Audit(AuditEvent.APPO_DELETE)
  async deleteAppointment(@Param('id') id: number) {
    const appointment = await this.appointmentService.deleteOne(+id);
    const message = `Appointment with id:${appointment.id} successfully deleted`;
    return buildResponseDto(appointment, message);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/generate/day')
  @Audit(AuditEvent.APPO_BY_DAY)
  async setAppointmentsByDay(
    @Body() requestBody: AppointmentRequestBody,
    @Actor() user: UserDto,
    @Query('user') userId: number,
  ) {
    try {
      const changedUser =
        await this.appointmentService.createFewAppointmentsOnOneDay(
          requestBody,
          user,
          userId,
        );
      if (!changedUser) {
        throw new Error('User not found');
      }
      return buildResponseDto(
        { id: changedUser.id, name: changedUser.name },
        'Successfully generated appointments',
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
