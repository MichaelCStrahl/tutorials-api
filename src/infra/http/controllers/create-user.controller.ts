import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateUserUseCase } from '@/application/use-cases/create-user'

const createUserAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateUserAccountBodySchema = z.infer<typeof createUserAccountBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createUserAccountBodySchema)

@Controller('/user/signup')
export class CreateUserAccountController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateUserAccountBodySchema) {
    const { name, email, password } = body

    await this.createUser.execute({
      name,
      email,
      password,
    })
  }
}
