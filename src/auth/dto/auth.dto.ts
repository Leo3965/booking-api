import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class Token {
  access_token: string
  constructor(token: string) {
    this.access_token = token
  }
}
