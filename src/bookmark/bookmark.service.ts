import { Injectable } from '@nestjs/common'
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto'

@Injectable()
export class BookmarkService {
  getAll(userId: number) {}

  get(userId: number, bookmarkId: number) {}

  create(userId: number, dto: CreateBookmarkDTO) {}

  edit(userId: number, bookmarkId: number, dto: EditBookmarkDTO) {}

  delete(userId: number, bookmarkId: number) {}
}
