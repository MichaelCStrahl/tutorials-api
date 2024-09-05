import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'

@Injectable()
export class PrismaTutorialRepository extends TutorialsRepository {
  constructor(private prisma: PrismaService) {
    super()
  }

  async create({
    title,
    slug,
    content,
    authorId,
  }: Omit<CreateTutorialUseCaseRequest, 'slug'> & {
    slug: NonNullable<string>
  }) {
    await this.prisma.tutorials.create({
      data: { title, slug, content, authorId },
    })
  }

  async findBySlug(slug: string) {
    const user = await this.prisma.tutorials.findUnique({
      where: {
        slug,
      },
    })

    return user
  }
}
