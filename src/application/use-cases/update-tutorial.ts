import { Injectable, NotFoundException } from '@nestjs/common'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { generateSlug } from '@/utils/generate-slug'
import { UsersRepository } from '@/application/repositories/users-repository'

export interface UpdateTutorialUseCaseRequest {
  id: string
  title?: string
  content?: string
  authorId: string
}

@Injectable()
export class UpdateTutorialUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tutorialsRepository: TutorialsRepository,
  ) {}

  async execute({
    id,
    title,
    content,
    authorId,
  }: UpdateTutorialUseCaseRequest) {
    const hasUser = await this.usersRepository.findById(authorId)

    if (!hasUser) {
      throw new NotFoundException('User not found.')
    }

    const tutorial = await this.tutorialsRepository.findById(id)

    if (!tutorial) {
      throw new NotFoundException('Tutorial not found.')
    }

    const hasTitle = !!title
    const slug = hasTitle ? generateSlug(title) : tutorial.slug

    return await this.tutorialsRepository.update({
      id,
      title,
      content,
      slug,
    })
  }
}
