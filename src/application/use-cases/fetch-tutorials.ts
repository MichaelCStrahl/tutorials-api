import { Injectable } from '@nestjs/common'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'

@Injectable()
export class FetchTutorialsUseCase {
  constructor(private tutorialsRepository: TutorialsRepository) {}

  async execute() {
    const tutorials = await this.tutorialsRepository.findMany()

    return { tutorials }
  }
}
