import { CreateUserUseCaseRequest } from '@/application/use-cases/create-user'

export abstract class UsersRepository {
  abstract create(user: CreateUserUseCaseRequest): Promise<void>

  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
}
