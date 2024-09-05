import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { makeTutorial } from 'test/factories/make-tutorial'
import { makeUser } from 'test/factories/make-user'

describe('Fetch Tutorials (e2e)', () => {
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

  test('[GET] /tutorial', async () => {
    const fakeUser = makeUser({})

    const userOnDatabase = await prisma.users.create({
      data: {
        name: fakeUser.name,
        email: fakeUser.email,
        password: await hash('password', 8),
      },
    })

    const accessToken = jwt.sign({ sub: userOnDatabase.id.toString() })

    const fakeTutorial1 = makeTutorial({
      title: 'First Tutorial',
    })

    await prisma.tutorials.create({
      data: {
        authorId: userOnDatabase.id,
        title: fakeTutorial1.title,
        content: fakeTutorial1.content,
        slug: fakeTutorial1.slug,
      },
    })

    const fakeTutorial2 = makeTutorial({
      title: 'Second Tutorial',
    })

    await prisma.tutorials.create({
      data: {
        authorId: userOnDatabase.id,
        title: fakeTutorial2.title,
        content: fakeTutorial2.content,
        slug: fakeTutorial2.slug,
      },
    })

    const response = await request(app.getHttpServer())
      .get('/tutorial')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)

    expect(response.body.tutorials).toHaveLength(2)

    expect(response.body.tutorials).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'First Tutorial',
        }),
        expect.objectContaining({
          title: 'Second Tutorial',
        }),
      ]),
    )
  })
})
