import { Module } from '@nestjs/common';
import { InstructorAvailabilityController } from './instructor-availability.controller';
import { InstructorAvailabilityService } from './instructor-availability.service';

@Module({
  controllers: [InstructorAvailabilityController],
  providers: [InstructorAvailabilityService]
})
export class InstructorAvailabilityModule {}
