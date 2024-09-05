import { InMemoryTutorialsRepository } from 'test/repositories/in-memory-tutorials-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { UpdateTutorialUseCase } from './update-tutorial'
import { makeTutorial } from 'test/factories/make-tutorial'
import { makeUser } from 'test/factories/make-user'
import { generateSlug } from '@/utils/generate-slug'
import { NotFoundException } from '@nestjs/common'

let inMemoryTutorialsRepository: InMemoryTutorialsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateTutorialUseCase

describe('Update Tutorial Use Case', () => {
  beforeEach(() => {
    inMemoryTutorialsRepository = new InMemoryTutorialsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UpdateTutorialUseCase(
      inMemoryUsersRepository,
      inMemoryTutorialsRepository,
    )
  })

  it('should be able update a tutorial', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const fakeTutorial = await makeTutorial({
      authorId: userOnDatabase.id,
    })

    inMemoryTutorialsRepository.create(fakeTutorial)

    const tutorialId = inMemoryTutorialsRepository.items[0].id

    const newTitle = 'Updated title'
    const newSlug = generateSlug(newTitle)

    await sut.execute({
      id: tutorialId,
      authorId: userOnDatabase.id,
      title: newTitle,
      content: 'Updated content',
    })

    expect(inMemoryTutorialsRepository.items[0]).toEqual(
      expect.objectContaining({
        id: tutorialId,
        authorId: userOnDatabase.id,
        title: newTitle,
        slug: newSlug,
        content: 'Updated content',
      }),
    )
  })

  it('should be able to update an tutorial by entering a some fields', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const fakeTutorial = await makeTutorial({
      authorId: userOnDatabase.id,
    })

    inMemoryTutorialsRepository.create(fakeTutorial)

    const tutorialId = inMemoryTutorialsRepository.items[0].id

    await sut.execute({
      id: tutorialId,
      authorId: userOnDatabase.id,
      content: 'Update content',
    })

    expect(inMemoryTutorialsRepository.items[0]).toEqual(
      expect.objectContaining({
        id: tutorialId,
        content: 'Update content',
      }),
    )
  })

  it('should not be able to update an tutorial if no fields are entered', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const fakeTutorial = await makeTutorial({
      authorId: userOnDatabase.id,
    })

    inMemoryTutorialsRepository.create(fakeTutorial)

    const tutorialId = inMemoryTutorialsRepository.items[0].id

    const tutorialBeforeUpdate = inMemoryTutorialsRepository.items[0]

    await sut.execute({
      id: tutorialId,
      authorId: userOnDatabase.id,
    })

    const tutorialAfterUpdate = inMemoryTutorialsRepository.items[0]

    expect(tutorialBeforeUpdate).toEqual(tutorialAfterUpdate)
  })

  it('should not be update a tutorial with wrong id', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    await expect(() =>
      sut.execute({ id: 'wrong-id', authorId: userOnDatabase.id }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })

  it('should not be possible to update a user other than tutorial', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const userOnDatabase = inMemoryUsersRepository.items[0]

    const fakeTutorial = await makeTutorial({
      authorId: userOnDatabase.id,
    })

    inMemoryTutorialsRepository.create(fakeTutorial)

    const tutorialId = inMemoryTutorialsRepository.items[0].id

    await expect(() =>
      sut.execute({
        id: tutorialId,
        title: 'Same Title',
        content: 'Same content',
        authorId: 'wrong-user-id',
      }),
    ).rejects.toBeInstanceOf(NotFoundException)
  })
})
