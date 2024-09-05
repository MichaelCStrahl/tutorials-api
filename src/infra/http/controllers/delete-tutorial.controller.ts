import { DeleteTutorialUseCase } from '@/application/use-cases/delete-tutorial'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('/tutorial/delete/:id')
@UseGuards(AuthGuard('jwt'))
export class DeleteTutorialController {
  constructor(private deleteTutorialUseCase: DeleteTutorialUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: authorId } = userPayload

    await this.deleteTutorialUseCase.execute({
      id,
      authorId,
    })
  }
}
