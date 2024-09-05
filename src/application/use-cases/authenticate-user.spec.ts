import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { AuthenticateUserUseCase } from './authenticate-user'
import { hash } from 'bcryptjs'
import { makeUser } from 'test/factories/make-user'
import { UnauthorizedException } from '@nestjs/common'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate a user', async () => {
    const hashedPassword = await hash('123456', 8)

    const user = makeUser({
      email: 'johndoe@example.com',
      password: hashedPassword,
    })

    inMemoryUsersRepository.create(user)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.userId).toEqual(userOnDatabase.id)
  })

  it('should not be able to authenticate with wrong email', async () => {
    const hashedPassword = await hash('123456', 8)

    const user = makeUser({
      email: 'johndoe@example.com',
      password: hashedPassword,
    })

    inMemoryUsersRepository.create(user)

    await expect(() =>
      sut.execute({
        email: 'wrong@mail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const hashedPassword = await hash('123456', 8)

    const user = makeUser({
      email: 'johndoe@example.com',
      password: hashedPassword,
    })

    inMemoryUsersRepository.create(user)

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })
})
