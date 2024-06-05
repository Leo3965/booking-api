import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from '../auth/decorator'
import { JWTGuard } from '../auth/guard'
import { BookmarkService } from './bookmark.service'
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto'

@Controller('bookmarks')
@UseGuards(JWTGuard)
export class BookmarkController {
  constructor(private service: BookmarkService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(@GetUser() user: User) {
    return this.service.getAll(user.id)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  get(@GetUser() user: User, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.service.get(user.id, bookmarkId)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser() user: User, @Body() dto: CreateBookmarkDTO) {
    return this.service.create(user.id, dto)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  edit(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDTO,
  ) {
    return this.service.edit(user.id, bookmarkId, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@GetUser() user: User, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.service.delete(user.id, bookmarkId)
  }
}
