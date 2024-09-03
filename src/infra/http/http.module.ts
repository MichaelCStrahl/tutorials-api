import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/prisma/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
