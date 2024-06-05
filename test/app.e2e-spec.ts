import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AuthDTO } from 'src/auth/dto'
import { EditUserDTO } from 'src/user/dto/edit-user.dto'
import { CreateBookmarkDTO, EditBookmarkDTO } from 'src/bookmark/dto'

let app: INestApplication
let prisma: PrismaService

const PORT = '3333'

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
    await app.listen(3333)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl(`http://localhost:${PORT}/`)
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => {
    const dto: AuthDTO = {
      email: 'leo@email.com',
      password: '123',
    }
    describe('Sign up', () => {
      it('Given an empty email then return 400', () => {
        return pactum
          .spec()
          .post(`auth/signup`)
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })

      it('Given an empty password then return 400', () => {
        return pactum
          .spec()
          .post(`auth/signup`)
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })

      it('Given an empty body then return 400', () => {
        return pactum
          .spec()
          .post(`auth/signup`)
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST)
      })

      it('Should sign up', () => {
        return pactum
          .spec()
          .post(`auth/signup`)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
      })
    })

    describe('Sign In', () => {
      it('Given an empty email then return 400', () => {
        return pactum
          .spec()
          .post(`auth/signin`)
          .withBody({ password: dto.password })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })

      it('Given an empty password then return 400', () => {
        return pactum
          .spec()
          .post(`auth/signin`)
          .withBody({ email: dto.email })
          .expectStatus(HttpStatus.BAD_REQUEST)
      })

      it('Given an empty body then return 400', () => {
        return pactum
          .spec()
          .post(`auth/signin`)
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST)
      })

      it('Should sign in', () => {
        return pactum
          .spec()
          .post(`auth/signin`)
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token') // saving token at pactum
      })
    })
  })

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('users/me')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .expectStatus(HttpStatus.OK)
      })
    })

    describe('Edit User', () => {
      const dto: EditUserDTO = {
        firstName: 'edit name',
        email: 'edit-email@email.com',
      }
      it('Should edit user', () => {
        return pactum
          .spec()
          .patch('users')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    })
  })

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .expectStatus(HttpStatus.OK)
          .expectBody([])
      })
    })

    describe('Create bookmarks', () => {
      const dto: CreateBookmarkDTO = {
        link: 'www.google.com',
        title: 'first book',
        description: 'this is a bookmark',
      }
      it('Should create bookmarks', () => {
        return pactum
          .spec()
          .post('bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title)
          .stores('bookmarkId', 'id')
      })
    })

    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1)
      })
    })

    describe('Get bookmark by id', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}')
      })
    })

    describe('Edit bookmarks', () => {
      const dto: EditBookmarkDTO = { description: 'updating description' }
      it('Should edit bookmarks', () => {
        return pactum
          .spec()
          .patch('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.description)
      })
    })

    describe('Delete bookmarks', () => {
      it('Should delete bookmark', () => {
        return pactum
          .spec()
          .delete('bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .expectStatus(HttpStatus.NO_CONTENT)
      })

      it('Should get empty bookmark', () => {
        return pactum
          .spec()
          .get('bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAt}` })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(0)
      })
    })
  })
})
