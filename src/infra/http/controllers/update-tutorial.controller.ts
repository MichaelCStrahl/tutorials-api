import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UpdateTutorialUseCase } from '@/application/use-cases/update-tutorial'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const updateTutorialBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

type UpdateTutorialBodySchema = z.infer<typeof updateTutorialBodySchema>

const bodyValidationPipe = new ZodValidationPipe(updateTutorialBodySchema)

@Controller('/tutorial/edit/:id')
@UseGuards(AuthGuard('jwt'))
export class UpdateTutorialController {
  constructor(private updateTutorialUseCase: UpdateTutorialUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe)
    body: UpdateTutorialBodySchema,
    @Param('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: authorId } = userPayload
    const { title, content } = body

    await this.updateTutorialUseCase.execute({
      id,
      authorId,
      title,
      content,
    })
  }
}
