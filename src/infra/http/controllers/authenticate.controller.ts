import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { AuthenticateUserUseCase } from '@/application/use-cases/authenticate-user'
import { JwtService } from '@nestjs/jwt'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@Controller('/user/login')
export class AuthenticateController {
  constructor(
    private authenticateUser: AuthenticateUserUseCase,
    private jwt: JwtService,
  ) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email, password } = body

    const { userId } = await this.authenticateUser.execute({ email, password })

    if (!userId) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwt.sign({
      sub: userId,
    })

    return {
      access_token: accessToken,
    }
  }
}
