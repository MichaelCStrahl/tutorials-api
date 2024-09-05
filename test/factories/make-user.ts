import { CreateUserUseCaseRequest } from '@/application/use-cases/create-user'
import { faker } from '@faker-js/faker'

export function makeUser(
  override: Partial<CreateUserUseCaseRequest>,
): CreateUserUseCaseRequest {
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  }

  return user
}
