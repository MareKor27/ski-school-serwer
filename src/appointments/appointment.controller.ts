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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    const dto = appointments.map((appointment) =>
      mapAppointmentToDto(appointment),
    );
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

  //Administrator Create apointment for users
  //ADD GUARD !!!!!!!!!!!!!!!
  @Post('/instructor/:id')
  async createAppointmentForInstructor(
    @Body() createAvailabilityDto: CreateAppointmentDto,
    @Param('id') id: number,
  ) {
    const appointment = await this.appointmentService.createAppointment(
      id,
      createAvailabilityDto.appointmentDate,
    );
    const message = `Appointment with id:${appointment.id} successfully created`;
    return buildResponseDto(appointment, message);
  }

  //Instructors creates own appointments
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async createAppointment(
    @Body() createAvailabilityDto: CreateAppointmentDto,
    @Actor() user: UserData,
  ) {
    const appointment = await this.appointmentService.createAppointment(
      user.id,
      createAvailabilityDto.appointmentDate,
    );
    const message = `Appointment with id:${appointment.id} successfully created`;
    return buildResponseDto(appointment, message);
  }

  @Patch(':id')
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
  async deleteAppointment(@Param('id') id: number) {
    const appointment = await this.appointmentService.deleteOne(+id);
    const message = `Appointment with id:${appointment.id} successfully delate`;
    return buildResponseDto(appointment, message);
  }
}
