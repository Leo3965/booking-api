import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from '../auth/decorator'
import { JWTGuard } from '../auth/guard'
import { EditUserDTO } from './dto/edit-user.dto'
import { UserService } from './user.service'

@Controller('users')
@UseGuards(JWTGuard)
export class UserController {
  constructor(private service: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: User) {
    return user
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  edit(@GetUser() user: User, @Body() dto: EditUserDTO): Promise<User> {
    return this.service.edit(user.id, dto)
  }
}
