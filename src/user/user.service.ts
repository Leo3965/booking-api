import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDTO } from './dto/edit-user.dto'

@Injectable()
export class UserService {
  constructor(private prima: PrismaService) {}

  async edit(id: number, dto: EditUserDTO): Promise<User> {
    const user = await this.prima.user.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    })

    return user
  }
}
