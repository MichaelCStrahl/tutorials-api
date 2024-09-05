import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'
import { generateSlug } from '@/utils/generate-slug'
import { faker } from '@faker-js/faker'

export function makeTutorial(
  override: Partial<CreateTutorialUseCaseRequest>,
): CreateTutorialUseCaseRequest {
  const title = faker.lorem.sentence(5)
  const slug = generateSlug(title)

  const tutorial = {
    title,
    slug,
    content: faker.lorem.paragraphs(5),
    authorId: faker.string.uuid(),
    ...override,
  }

  return tutorial
}
