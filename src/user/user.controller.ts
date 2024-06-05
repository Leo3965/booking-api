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
import { User } from '@prisma/client'

@Controller('users')
export class UserController {
  constructor() {}

  @UseGuards(JWTGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: APIToken){
    return user
  }
}
