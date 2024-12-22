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
import { InstructorAvailabilityService } from './instructor-availability.service';
import { CreateAvailabilityDto } from './dto/createAvailability.dto';
import { UpdateAvailabilityDto } from './dto/updateAvailability.dto';

@Controller('instructor-availability')
export class InstructorAvailabilityController {
  constructor(
    private readonly instructorAvailabilityService: InstructorAvailabilityService,
  ) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.instructorAvailabilityService.findOne(id);
  }

  @Get()
  findAll(
    @Query('instruktor') idInstructor?: number,
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('day') day?: number,
    @Query('weekday') weekday?: number,
    @Query('hour') hour?: number,
  ) {
    return this.instructorAvailabilityService.findAll({
      idInstructor,
      year,
      month,
      day,
      weekday,
      hour,
    });
  }

  @Post()
  createOne(
    @Body(ValidationPipe) createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return this.instructorAvailabilityService.createOne(createAvailabilityDto);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body(ValidationPipe) updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.instructorAvailabilityService.updateOne(
      id,
      updateAvailabilityDto,
    );
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.instructorAvailabilityService.deleteOne(+id);
  }
}
