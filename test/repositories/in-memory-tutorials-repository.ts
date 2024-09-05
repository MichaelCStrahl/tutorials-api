import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'
import { UpdateTutorialUseCaseRequest } from '@/application/use-cases/update-tutorial'
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

  async findById(id: string) {
    const tutorial = this.items.find((item) => item.id === id)

    if (!tutorial) {
      return null
    }

    return tutorial
  }

  async update({
    id,
    title,
    slug,
    content,
  }: Omit<UpdateTutorialUseCaseRequest, 'authorId'> & { slug: string }) {
    const index = this.items.findIndex((item) => item.id === id)

    const tutorial = this.items[index]

    const updatedTutorial = {
      ...tutorial,
      title: title ?? tutorial.title,
      slug: slug ?? tutorial.slug,
      content: content ?? tutorial.content,
      updatedAt: new Date(),
    }

    this.items[index] = updatedTutorial

    return updatedTutorial
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)

    this.items.splice(index, 1)
  }
}
