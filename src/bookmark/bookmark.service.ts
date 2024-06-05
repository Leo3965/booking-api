import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto'

@Injectable()
export class BookmarkService {
  constructor(private prima: PrismaService) {}

  getAll(userId: number) {
    return this.prima.bookmark.findMany({ where: { userId } })
  }

  get(userId: number, bookmarkId: number) {
    return this.prima.bookmark.findFirst({ where: { userId, id: bookmarkId } })
  }

  async create(userId: number, dto: CreateBookmarkDTO) {
    return await this.prima.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    })
  }

  async edit(userId: number, bookmarkId: number, dto: EditBookmarkDTO) {
    await this.userOwnsBookmark(userId, bookmarkId)
    return this.prima.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    })
  }

  async delete(userId: number, bookmarkId: number): Promise<void> {
    await this.userOwnsBookmark(userId, bookmarkId)
    await this.prima.bookmark.delete({ where: { id: bookmarkId } })
  }

  private async userOwnsBookmark(userId: number, bookmarkId: number): Promise<void> {
    const bookmark = await this.prima.bookmark.findUnique({
      where: { id: bookmarkId },
    })

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resource denied')
    }
  }
}
