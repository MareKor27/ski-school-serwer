import { Test, TestingModule } from '@nestjs/testing';
import { InstructorAvailabilityController } from './instructor-availability.controller';

describe('InstructorAvailabilityController', () => {
  let controller: InstructorAvailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstructorAvailabilityController],
    }).compile();

    controller = module.get<InstructorAvailabilityController>(InstructorAvailabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
