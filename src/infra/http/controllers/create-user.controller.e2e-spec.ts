import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { makeUser } from 'test/factories/make-user'
import request from 'supertest'

describe('Create Account (e2e)', () => {
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

  test('[POST] /user/signup', async () => {
    const fakeUser = makeUser({ email: 'johndoe@example.com' })
    const response = await request(app.getHttpServer())
      .post('/user/signup')
      .send(fakeUser)

    expect(response.status).toBe(201)

    const userOnDatabase = await prisma.users.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
