import { UsersRepository } from '@/application/repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { CreateUserUseCaseRequest } from '@/application/use-cases/create-user'

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(private prisma: PrismaService) {
    super()
  }

  async create({ name, email, password }: CreateUserUseCaseRequest) {
    await this.prisma.users.create({
      data: {
        name,
        email,
        password,
      },
    })
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    })

    return user
  }
}
