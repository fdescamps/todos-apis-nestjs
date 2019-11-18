import { Module } from '@nestjs/common';

import { KeyvaultService } from './keyvault.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  exports: [KeyvaultService],
  imports: [UtilsModule],
  providers: [KeyvaultService],
})
export class KeyvaultModule {}
