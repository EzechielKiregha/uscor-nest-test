import { Injectable } from '@nestjs/common'
import { AuthDto } from 'src/dto'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {
    return { msg: 'I have logged in' }
  }
  async signup(dto: AuthDto) {
    // generate passwd
    const hash = await argon.hash(dto.password)
    // save the user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash: hash
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true
      }
    })
    return user
  }
}
