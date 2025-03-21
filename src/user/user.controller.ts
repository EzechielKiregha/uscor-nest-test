/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from './../auth/decorator'
import { JwtAuthGuard } from './../auth/guard'

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user
  }
}
