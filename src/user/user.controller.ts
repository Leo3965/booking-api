import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { GetUser } from '../auth/decorator'
import { JWTGuard } from '../auth/guard'
import { APIToken } from '../auth/model/api-token.model'

@Controller('users')
export class UserController {
  constructor() {}

  @UseGuards(JWTGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: APIToken): APIToken {
    return user
  }
}
