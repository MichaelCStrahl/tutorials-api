import { InMemoryTutorialsRepository } from 'test/repositories/in-memory-tutorials-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeTutorial } from 'test/factories/make-tutorial'
import { makeUser } from 'test/factories/make-user'
import { FetchTutorialsUseCase } from './fetch-tutorials'

let inMemoryTutorialsRepository: InMemoryTutorialsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchTutorialsUseCase

describe('Fetch Tutorials Use Case', () => {
  beforeEach(() => {
    inMemoryTutorialsRepository = new InMemoryTutorialsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new FetchTutorialsUseCase(inMemoryTutorialsRepository)
  })

  it('should be able fetch tutorials', async () => {
    const fakeUser = await makeUser({ name: 'John Doe' })
    inMemoryUsersRepository.create(fakeUser)

    const authorId = inMemoryUsersRepository.items[0].id

    ;[1, 2, 3, 4].map((item) =>
      inMemoryTutorialsRepository.create(
        makeTutorial({ title: `Tutorial ${item}`, authorId }),
      ),
    )

    const result = await sut.execute()

    expect(result.tutorials).toHaveLength(4)
  })

  it("should not be fetch tutorials if doesn't exists", async () => {
    const result = await sut.execute()

    expect(result.tutorials).toHaveLength(0)
  })
})
