import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/prisma/database.module'
import { CreateUserAccountController } from '@/infra/http/controllers/create-user.controller'
import { CreateUserUseCase } from '@/application/use-cases/create-user'
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller'
import { CreateTutorialUseCase } from '@/application/use-cases/create-tutorial'
import { CreateTutorialController } from '@/infra/http/controllers/create-tutorial.controller'
import { UpdateTutorialUseCase } from '@/application/use-cases/update-tutorial'
import { UpdateTutorialController } from '@/infra/http/controllers/update-tutorial.controller'
import { DeleteTutorialUseCase } from '@/application/use-cases/delete-tutorial'
import { DeleteTutorialController } from '@/infra/http/controllers/delete-tutorial.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateUserAccountController,
    AuthenticateController,
    CreateTutorialController,
    UpdateTutorialController,
    DeleteTutorialController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateTutorialUseCase,
    UpdateTutorialUseCase,
    DeleteTutorialUseCase,
  ],
})
export class HttpModule {}
