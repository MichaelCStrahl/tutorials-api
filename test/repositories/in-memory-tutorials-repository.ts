import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'
import { randomUUID } from 'node:crypto'

export class InMemoryTutorialsRepository extends TutorialsRepository {
  public items: Tutorial[] = []
  async create({
    title,
    slug,
    content,
    authorId,
  }: Omit<CreateTutorialUseCaseRequest, 'slug'> & {
    slug: NonNullable<string>
  }) {
    const tutorialUUID = randomUUID()

    const newTutorial: Tutorial = {
      id: tutorialUUID,
      title,
      content,
      slug,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(newTutorial)
  }

  async findBySlug(slug: string) {
    const tutorial = this.items.find((item) => item.slug === slug)

    if (!tutorial) {
      return null
    }

    return tutorial
  }
}
