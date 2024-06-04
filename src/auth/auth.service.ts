import { Injectable } from '@nestjs/common'

@Injectable({})
export class AuthService {
  login(): { msg: string } {
    return { msg: 'I am sign in' }
  }

  signUp(): { msg: string } {
    return { msg: 'I am sign up' }
  }
}
