import { UsersRepository } from '@/application/repositories/users-repository'
import { CreateUserUseCaseRequest } from '@/application/use-cases/create-user'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository extends UsersRepository {
  public items: User[] = []
  async create({ name, email, password }: CreateUserUseCaseRequest) {
    const userUUID = randomUUID()

    const newUser: User = {
      id: userUUID,
      name,
      email,
      password,
    }

    this.items.push(newUser)
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }
}
