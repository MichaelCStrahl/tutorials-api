import { InMemoryTutorialsRepository } from 'test/repositories/in-memory-tutorials-repository'
import { makeUser } from 'test/factories/make-user'
import { ConflictException } from '@nestjs/common'
import { CreateTutorialUseCase } from './create-tutorial'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeTutorial } from 'test/factories/make-tutorial'

let inMemoryTutorialsRepository: InMemoryTutorialsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateTutorialUseCase

describe('Create Tutorial Use Case', () => {
  beforeEach(() => {
    inMemoryTutorialsRepository = new InMemoryTutorialsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new CreateTutorialUseCase(
      inMemoryUsersRepository,
      inMemoryTutorialsRepository,
    )
  })

  it('should be able create a new tutorial', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const fakeTutorial = await makeTutorial({ authorId: userOnDatabase.id })

    await sut.execute(fakeTutorial)

    expect(inMemoryTutorialsRepository.items[0].slug).toEqual(fakeTutorial.slug)
  })

  it('should not be able to create a tutorial with wrong author id', async () => {
    const fakeTutorial = await makeTutorial({ authorId: 'wrong-author-id' })

    await expect(() => sut.execute(fakeTutorial)).rejects.toBeInstanceOf(
      ConflictException,
    )
  })

  it('should not be able to create a tutorial with same the title twice', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const fakeTutorial = await makeTutorial({
      title: 'Same title',
      authorId: userOnDatabase.id,
    })

    await sut.execute(fakeTutorial)

    const fakeTutorial2 = await makeTutorial({
      title: 'Same title',
      authorId: userOnDatabase.id,
    })

    await expect(() => sut.execute(fakeTutorial2)).rejects.toBeInstanceOf(
      ConflictException,
    )
  })
})
