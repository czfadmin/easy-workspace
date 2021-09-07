import { UserService } from '../user/user.service';
import { jwtConstants } from './constrants';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private accountService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateAccount(username: string, pwd: string) {
    const account = await this.accountService.findOneByUsername(username, pwd);
    if (account && bcrypt.compareSync(pwd, account.password)) {
      const { password, ...user } = account;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async getUserInfoFromToken(token: string) {
    const payload = await this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });
    console.log(payload);
  }
}
