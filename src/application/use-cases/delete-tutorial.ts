import { Injectable, NotFoundException } from '@nestjs/common'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { UsersRepository } from '@/application/repositories/users-repository'

export interface DeleteTutorialUseCaseRequest {
  id: string
  authorId: string
}

@Injectable()
export class DeleteTutorialUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private tutorialsRepository: TutorialsRepository,
  ) {}

  async execute({ id, authorId }: DeleteTutorialUseCaseRequest) {
    const hasTutorial = await this.tutorialsRepository.findById(id)

    if (!hasTutorial) {
      throw new NotFoundException('Tutorial not found.')
    }

    const hasUser = await this.usersRepository.findById(authorId)

    if (!hasUser) {
      throw new NotFoundException('User not found.')
    }

    await this.tutorialsRepository.delete(id)
  }
}
