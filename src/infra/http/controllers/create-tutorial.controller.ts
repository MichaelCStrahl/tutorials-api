import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateTutorialUseCase } from '@/application/use-cases/create-tutorial'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createTutorialBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateTutorialBodySchema = z.infer<typeof createTutorialBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createTutorialBodySchema)

@Controller('/tutorial/new')
@UseGuards(AuthGuard('jwt'))
export class CreateTutorialController {
  constructor(private createTutorial: CreateTutorialUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateTutorialBodySchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: authorId } = userPayload

    const { title, content } = body

    await this.createTutorial.execute({ title, content, authorId })
  }
}
