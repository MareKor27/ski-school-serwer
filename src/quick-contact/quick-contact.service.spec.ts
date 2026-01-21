import { Test, TestingModule } from '@nestjs/testing';
import { QuickContactService } from './quick-contact.service';

describe('QuickContactService', () => {
  let service: QuickContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuickContactService],
    }).compile();

    service = module.get<QuickContactService>(QuickContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
