import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { AuthDTO } from 'src/auth/dto'

let app: INestApplication
let prisma: PrismaService

const PORT = '3333'

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true }),
    )
    await app.init()
    await app.listen(3333)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
    pactum.request.setBaseUrl(
      `http://localhost:${PORT}/`,
    )
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
          .withHeaders({Authorization: `Bearer $S{userAt}`})
          .expectStatus(HttpStatus.OK)
          .inspect()
      })
    })
    describe('Edit User', () => {})
  })

  describe('Bookmarks', () => {
    describe('Create bookmarks', () => {})
    describe('Get bookmarks', () => {})
    describe('Get bookmark by id', () => {})
    describe('Edit bookmarks', () => {})
    describe('Delete bookmarks', () => {})
  })
})
