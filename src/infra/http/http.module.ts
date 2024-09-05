import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/prisma/database.module'
import { CreateUserAccountController } from '@/infra/http/controllers/create-user.controller'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateTutorialUseCase } from '@/application/use-cases/create-tutorial'
import { CreateTutorialController } from './controllers/create-tutorial.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateUserAccountController,
    AuthenticateController,
    CreateTutorialController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateTutorialUseCase,
  ],
})
export class HttpModule {}
