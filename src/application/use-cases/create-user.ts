import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { UsersRepository } from '@/application/repositories/users-repository'

export interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
}

@Injectable()
export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: CreateUserUseCaseRequest) {
    const hasUser = await this.usersRepository.findByEmail(email)

    if (hasUser) {
      throw new ConflictException('User already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })
  }
}
