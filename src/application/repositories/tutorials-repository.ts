import { CreateTutorialUseCaseRequest } from '../use-cases/create-tutorial'

export abstract class TutorialsRepository {
  abstract create(
    tutorial: Omit<CreateTutorialUseCaseRequest, 'slug'> & {
      slug: NonNullable<string>
    },
  ): Promise<void>

  abstract findBySlug(email: string): Promise<Tutorial | null>
}
