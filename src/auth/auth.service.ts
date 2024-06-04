import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDTO } from './dto'

@Injectable()
export class AuthService {
  constructor(prisma: PrismaService) {}

  login(): { msg: string } {
    return { msg: 'I am sign in' }
  }

  signUp(dto: AuthDTO): AuthDTO {
    return dto
  }
}
