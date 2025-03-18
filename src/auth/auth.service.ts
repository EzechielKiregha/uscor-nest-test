import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { AuthDto } from 'src/auth/dto'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      })
    // if not exist throw 3xception
    if (!user) {
      throw new ForbiddenException(
        'Email or password is incorrect',
      )
    }
    // compare passwords
    const match = await argon.verify(
      user.hash,
      dto.password,
    )
    // if password don't match throw 3xception
    if (!match) {
      throw new ForbiddenException(
        'Email or password is incorrect',
      )
    }
    // return token
    return this.signToken(user.id, user.email)
  }
  async signup(dto: AuthDto) {
    // generate passwd
    const pwhash = await argon.hash(dto.password)
    // save the user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: pwhash,
        },
      })
      // return token
      return this.signToken(user.id, user.email)
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Email already exists',
          )
        }
      }
      throw error
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    }

    const acces_token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    )
    return { access_token: acces_token }
  }
}
