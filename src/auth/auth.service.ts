import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(prisma: PrismaService) {}

  login(): { msg: string } {
    return { msg: 'I am sign in' }
  }

  signUp(): { msg: string } {
    return { msg: 'I am sign up' }
  }
}
