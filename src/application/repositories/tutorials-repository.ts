import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'
import { UpdateTutorialUseCaseRequest } from '@/application/use-cases/update-tutorial'

export abstract class TutorialsRepository {
  abstract create(
    tutorial: Omit<CreateTutorialUseCaseRequest, 'slug'> & {
      slug: NonNullable<string>
    },
  ): Promise<void>

  abstract findBySlug(slug: string): Promise<Tutorial | null>
  abstract findById(id: string): Promise<Tutorial | null>
  abstract update(
    data: Omit<UpdateTutorialUseCaseRequest, 'authorId'> & { slug: string },
  ): Promise<Tutorial>
}
