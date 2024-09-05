import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { makeTutorial } from 'test/factories/make-tutorial'
import { makeUser } from 'test/factories/make-user'
import request from 'supertest'

describe('Delete Tutorial (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /tutorial/delete/:id', async () => {
    const fakeUser = makeUser({})

    const userOnDatabase = await prisma.users.create({
      data: {
        name: fakeUser.name,
        email: fakeUser.email,
        password: await hash('password', 8),
      },
    })

    const accessToken = jwt.sign({ sub: userOnDatabase.id.toString() })

    const fakeTutorial = makeTutorial({
      authorId: userOnDatabase.id,
    })

    const tutorialOnDatabase = await prisma.tutorials.create({
      data: {
        authorId: userOnDatabase.id,
        title: fakeTutorial.title,
        slug: fakeTutorial.slug,
        content: fakeTutorial.content,
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/tutorial/delete/${tutorialOnDatabase.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(204)

    const tutorialDeletedOnDatabase = await prisma.tutorials.findUnique({
      where: {
        id: tutorialOnDatabase.id,
      },
    })

    expect(tutorialDeletedOnDatabase).toBeNull()
  })
})
