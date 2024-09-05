import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/prisma/database.module'
import { CreateUserAccountController } from '@/infra/http/controllers/create-user.controller'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateTutorialUseCase } from '@/application/use-cases/create-tutorial'
import { CreateTutorialController } from './controllers/create-tutorial.controller'
import { UpdateTutorialUseCase } from '@/application/use-cases/update-tutorial'
import { UpdateTutorialController } from './controllers/update-tutorial.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateUserAccountController,
    AuthenticateController,
    CreateTutorialController,
    UpdateTutorialController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateTutorialUseCase,
    UpdateTutorialUseCase,
  ],
})
export class HttpModule {}
