import { FetchTutorialsUseCase } from '@/application/use-cases/fetch-tutorials'
import { Controller, UseGuards, Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('/tutorial')
@UseGuards(AuthGuard('jwt'))
export class FetchTutorialsController {
  constructor(private fetchTutorialsUseCase: FetchTutorialsUseCase) {}

  @Get()
  async handle() {
    const { tutorials } = await this.fetchTutorialsUseCase.execute()

    return { tutorials }
  }
}
