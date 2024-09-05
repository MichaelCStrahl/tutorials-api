import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { CreateUserUseCase } from './create-user'
import { makeUser } from 'test/factories/make-user'
import { compare } from 'bcryptjs'
import { ConflictException } from '@nestjs/common'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able create a new user', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    await sut.execute(fakeUser)

    expect(inMemoryUsersRepository.items[0].name).toEqual(fakeUser.name)
  })

  it('should hash admin password upon registration', async () => {
    const fakeUser = await makeUser({ password: '123456' })
    await sut.execute(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const comparePassword = await compare('123456', userOnDatabase.password)

    expect(comparePassword).toBe(true)
  })

  it('should not be able to create a user with same the email twice', async () => {
    const fakeUser = await makeUser({ email: 'johndoe@example.com' })
    await sut.execute(fakeUser)

    const fakeUser2 = await makeUser({ email: 'johndoe@example.com' })

    await expect(() => sut.execute(fakeUser2)).rejects.toBeInstanceOf(
      ConflictException,
    )
  })
})
