import { Module } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { UsersRepository } from '@/application/repositories/users-repository'
import { PrismaUsersRepository } from '@/infra/prisma/repositories/prisma-users-repository'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { PrismaTutorialRepository } from '@/infra/prisma/repositories/prisma-tutorials-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: TutorialsRepository,
      useClass: PrismaTutorialRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, TutorialsRepository],
})
export class DatabaseModule {}
