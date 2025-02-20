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
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/createAppointment.dto';
import { UpdateAppointmentDto } from './dto/updateAppointment.dto';
import { AppointmentDto } from './dto/appointment.dto';
import { mapAppointmentToDto } from './dto/appointment.dto.mapper';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get(':id')
  async getAppointment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AppointmentDto> {
    const appointment = await this.appointmentService.findOne(id);
    const dto = mapAppointmentToDto(appointment);
    return dto;
  }

  @Get()
  readAppointments(
    @Query('instruktor') idInstructor?: number,
    @Query('date') appointmentDate?: Date,
    @Query('dostepne') available?: boolean,
  ) {
    return this.appointmentService.findAll({
      idInstructor,
      appointmentDate,
      available,
    });
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
