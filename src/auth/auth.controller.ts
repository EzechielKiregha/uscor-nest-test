import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    console.log({
      email: email,
      password: password,
    })
    return this.authService.login()
  }
  @Post('signup')
  signup() {
    return this.authService.signup()
  }
}
