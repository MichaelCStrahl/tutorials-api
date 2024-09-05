import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'
import { generateSlug } from '@/utils/generate-slug'
import { faker } from '@faker-js/faker'

type MakeTutorialResponse = Omit<CreateTutorialUseCaseRequest, 'slug'> & {
  slug: NonNullable<string>
}

export function makeTutorial(
  override: Partial<CreateTutorialUseCaseRequest>,
): MakeTutorialResponse {
  const title = faker.lorem.sentence(5)
  const slug = generateSlug(title) as string

  const tutorial = {
    title,
    slug,
    content: faker.lorem.paragraphs(5),
    ...override,
  } as MakeTutorialResponse

  return tutorial
}
