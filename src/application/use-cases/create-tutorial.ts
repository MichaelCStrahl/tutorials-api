import { ConflictException, Injectable } from '@nestjs/common'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { generateSlug } from '@/utils/generate-slug'
import { UsersRepository } from '@/application/repositories/users-repository'

export interface CreateTutorialUseCaseRequest {
  title: string
  slug?: string | null
  content: string
  authorId: string
}

@Injectable()
export class CreateTutorialUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tutorialsRepository: TutorialsRepository,
  ) {}

  async execute({ title, content, authorId }: CreateTutorialUseCaseRequest) {
    const slug = generateSlug(title)

    const hasTutorial = await this.tutorialsRepository.findBySlug(slug)

    if (hasTutorial) {
      throw new ConflictException('Title already used.')
    }

    const hasUser = await this.usersRepository.findById(authorId)

    if (!hasUser) {
      throw new ConflictException('User not found.')
    }

    await this.tutorialsRepository.create({
      title,
      content,
      authorId,
      slug,
    })
  }
}
