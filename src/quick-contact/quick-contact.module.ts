import { Module } from '@nestjs/common';
import { QuickContactController } from './quick-contact.controller';
import { QuickContactService } from './quick-contact.service';

@Module({
  controllers: [QuickContactController],
  providers: [QuickContactService],
})
export class QuickContactModule {}
