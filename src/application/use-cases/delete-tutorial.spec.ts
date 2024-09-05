import { InMemoryTutorialsRepository } from 'test/repositories/in-memory-tutorials-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { DeleteTutorialUseCase } from './delete-tutorial'
import { makeTutorial } from 'test/factories/make-tutorial'
import { makeUser } from 'test/factories/make-user'
import { NotFoundException } from '@nestjs/common'

let inMemoryTutorialsRepository: InMemoryTutorialsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteTutorialUseCase

describe('Delete Tutorial Use Case', () => {
  beforeEach(() => {
    inMemoryTutorialsRepository = new InMemoryTutorialsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteTutorialUseCase(
      inMemoryUsersRepository,
      inMemoryTutorialsRepository,
    )
  })

  it('should be able delete a tutorial', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const authorId = inMemoryUsersRepository.items[0].id

    const fakeTutorial = await makeTutorial({
      authorId,
    })

    inMemoryTutorialsRepository.create(fakeTutorial)

    const tutorialId = inMemoryTutorialsRepository.items[0].id

    await sut.execute({
      id: tutorialId,
      authorId,
    })

    expect(inMemoryTutorialsRepository.items).toHaveLength(0)
  })

  it('should not be delete a tutorial with wrong id', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const authorId = inMemoryUsersRepository.items[0].id

    await expect(() =>
      sut.execute({
        id: 'wrong-id',
        authorId,
      }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should not be possible to delete a user other than tutorial', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const authorId = inMemoryUsersRepository.items[0].id

    const fakeTutorial = await makeTutorial({
      authorId,
    })

    inMemoryTutorialsRepository.create(fakeTutorial)

    const tutorialId = inMemoryTutorialsRepository.items[0].id

    await expect(() =>
      sut.execute({
        id: tutorialId,
        authorId: 'wrong-user-id',
      }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })
})
