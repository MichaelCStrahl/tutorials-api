import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/prisma/database.module'
import { CreateUserAccountController } from '@/infra/http/controllers/create-user.controller'
import { CreateUserUseCase } from '@/application/use-cases/create-user'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserAccountController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}
