import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { TutorialsRepository } from '@/application/repositories/tutorials-repository'
import { CreateTutorialUseCaseRequest } from '@/application/use-cases/create-tutorial'
import { UpdateTutorialUseCaseRequest } from '@/application/use-cases/update-tutorial'

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
    const tutorial = await this.prisma.tutorials.findUnique({
      where: {
        slug,
      },
    })

    return tutorial
  }

  async findById(id: string) {
    const tutorial = await this.prisma.tutorials.findUnique({
      where: {
        id,
      },
    })

    return tutorial
  }

  async findMany() {
    const tutorials = await this.prisma.tutorials.findMany()

    return tutorials
  }

  async update({
    id,
    title,
    slug,
    content,
  }: Omit<UpdateTutorialUseCaseRequest, 'authorId'> & {
    slug: string
  }) {
    const tutorial = await this.prisma.tutorials.update({
      where: { id },
      data: {
        title,
        slug,
        content,
      },
    })

    return tutorial
  }

  async delete(id: string) {
    await this.prisma.tutorials.delete({ where: { id } })
  }
}
