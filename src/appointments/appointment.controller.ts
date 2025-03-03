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
  ) {
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
  createAppointment(
    @Body(ValidationPipe) createAvailabilityDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.createOne(createAvailabilityDto);
  }

  @Patch(':id')
  updateAppointment(
    @Param('id') id: number,
    @Body(ValidationPipe) updateAvailabilityDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateOne(id, updateAvailabilityDto);
  }

  @Delete(':id')
  deleteAppointment(@Param('id') id: number) {
    return this.appointmentService.deleteOne(+id);
  }
}
