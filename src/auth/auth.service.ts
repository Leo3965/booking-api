import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDTO } from './dto'
import * as argon from 'argon2'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: AuthDTO): Promise<User> {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credentials incorrect')
    }

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password)

    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect')
    }

    delete user.hash
    // send back user
    return user
  }

  async signUp(dto: AuthDTO): Promise<User> {
    // generate the password hash
    const hash = await argon.hash(dto.password)

    try {
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      })
      // return the saved user
      delete user.hash
      return user
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken')
        }
      }

      throw err
    }
  }
}
