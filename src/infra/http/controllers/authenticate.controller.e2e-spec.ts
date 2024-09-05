import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import { makeUser } from 'test/factories/make-user'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const userEmail = 'johndoe@example.com'
    const userPassword = '123456'
    const hashedPassword = await hash(userPassword, 8)

    const fakeUser = makeUser({
      email: userEmail,
      password: hashedPassword,
    })

    await prisma.users.create({
      data: {
        name: fakeUser.name,
        email: fakeUser.email,
        password: fakeUser.password,
      },
    })

    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: userEmail,
        password: userPassword,
      })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
