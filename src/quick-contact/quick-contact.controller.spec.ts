import { Test, TestingModule } from '@nestjs/testing';
import { QuickContactController } from './quick-contact.controller';

describe('QuickContactController', () => {
  let controller: QuickContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickContactController],
    }).compile();

    controller = module.get<QuickContactController>(QuickContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
