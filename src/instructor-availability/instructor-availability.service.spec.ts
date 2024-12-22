import { Test, TestingModule } from '@nestjs/testing';
import { InstructorAvailabilityService } from './instructor-availability.service';

describe('InstructorAvailabilityService', () => {
  let service: InstructorAvailabilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstructorAvailabilityService],
    }).compile();

    service = module.get<InstructorAvailabilityService>(InstructorAvailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
