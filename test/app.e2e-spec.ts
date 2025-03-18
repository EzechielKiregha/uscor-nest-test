import { describe } from 'node:test'
import {
  Test,
  TestingModule,
} from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import * as pactum from 'pactum'
import { PrismaService } from '../src/prisma/prisma.service'
import { AuthDto } from '../src/auth/dto'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
describe('App e2e', () => {
  let app: INestApplication
  let prismaservice: PrismaService
  beforeAll(async () => {
    const moduleRef: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    await app.init()
    await app.listen(3001)

    prismaservice = app.get(PrismaService)

    await prismaservice.cleanDb()
    pactum.request.setBaseUrl(
      'http://localhost:3001',
    )
  })
  afterAll(async () => {
    await app.close()
  })
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'eze@gmail.com',
      password: '123',
    }
    describe('Signup', () => {
      it('should throw an error if the email is not valid or empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })
      it('should throw an error if the password is not valid or empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })
      it('should throw an error if nobody is provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400)
      })
      it('should create a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })
      describe('Login', () => {
        it('should throw an error if the email is not valid or empty', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({
              password: dto.password,
            })
            .expectStatus(400)
        })
        it('should throw an error if the password is not valid or empty', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({
              email: dto.email,
            })
            .expectStatus(400)
        })
        it('should throw an error if nobody is provided', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody({})
            .expectStatus(400)
        })
        it('should return a token', () => {
          return pactum
            .spec()
            .post('/auth/login')
            .withBody(dto)
            .expectStatus(200)
        })
      })
    })
  })
  describe('Users', () => {
    describe('Get me', () => {
      it('should return the user', () => {})
    })
    describe('Update user', () => {
      it('should update the user', () => {})
    })
  })
  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it('should create a bookmark', () => {})
    })
    describe('Get bookmarks', () => {
      it('should return the bookmarks', () => {})
    })
    describe('Get bookmark by id', () => {
      it('should return the bookmark', () => {})
    })
    describe('Delete bookmark', () => {
      it('should delete the bookmark', () => {})
    })
  })
})
