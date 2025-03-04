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

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get(':id')
  async getAppointment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDto<AppointmentDto>> {
    const appointment = await this.appointmentService.findOne(id);
    if (!appointment)
      throw new NotFoundException(`Reservation with id ${id} not found`);
    const dto = mapAppointmentToDto(appointment);
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
    const dto = appointments.map(mapAppointmentToDto);

    return buildCollectionsResponseDto(dto, { page, size, totalRows });
  }

  @Post()
  async createAppointment(
    @Body(ValidationPipe) createAvailabilityDto: CreateAppointmentDto,
  ) {
    const appointment = await this.appointmentService.createOne(
      createAvailabilityDto,
    );
    const message = `Appointment with id:${appointment.id} successfully created`;
    return buildResponseDto(appointment, message);
  }

  @Patch(':id')
  async updateAppointment(
    @Param('id') id: number,
    @Body(ValidationPipe) updateAvailabilityDto: UpdateAppointmentDto,
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
