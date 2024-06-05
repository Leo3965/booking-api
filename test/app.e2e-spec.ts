import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

describe('AppController (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
  })

  it.todo('should pass')
  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
})
