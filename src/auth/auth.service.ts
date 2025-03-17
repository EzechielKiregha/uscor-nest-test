import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthDto } from 'src/dto'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })
    // if not exist throw 3xception
    if (!user) {
      throw new ForbiddenException('Email or password is incorrect')
    }
    // compare passwords
    const match = await argon.verify(user.hash, dto.password)
    // if password don't match throw 3xception
    if (!match) {
      throw new ForbiddenException('Email or password is incorrect')
    }
    // send back the user without the hash
    const { hash, ...result } = user
    return result
  }
  async signup(dto: AuthDto) {
    // generate passwd
    const pwhash = await argon.hash(dto.password)
    // save the user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: pwhash
        }
      })
      const { hash, ...result } = user
      return result
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists')
        }
      }
      throw error
    }
  }
}
