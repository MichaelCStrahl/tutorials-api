import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeTutorial } from 'test/factories/make-tutorial'
import { makeUser } from 'test/factories/make-user'

describe('Create Tutorial (e2e)', () => {
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

  test('[POST] /tutorial/new', async () => {
    const fakeUser = makeUser({
      name: 'John Doe',
    })

    const userOnDatabase = await prisma.users.create({
      data: {
        name: fakeUser.name,
        email: fakeUser.email,
        password: fakeUser.password,
      },
    })

    const accessToken = jwt.sign({ sub: userOnDatabase.id.toString() })

    const fakeTutorial = makeTutorial({
      authorId: userOnDatabase.id,
    })

    const response = await request(app.getHttpServer())
      .post('/tutorial/new')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeTutorial)

    expect(response.status).toBe(201)
  })
})
