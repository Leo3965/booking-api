import { Controller, Get, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/auth/decorator'
import { JWTGuard } from 'src/auth/guard'
import { APIToken } from 'src/auth/model/api-token.model'

@Controller('users')
export class UserController {
  constructor() {}

  @UseGuards(JWTGuard)
  @Get('me')
  getMe(@GetUser() user: APIToken) : APIToken {
    return user
  }
}
