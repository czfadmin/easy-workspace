import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'with-jwt/src/user/user.service';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';

import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    Inject,
    Get,
    Query,
} from '@nestjs/common';
import axios from 'axios';
import { Public } from './constrants';
import { GithubAuthGuard } from './guards/github-auth.guard';
import passport from 'passport';
import { Request as HttpRequest } from 'express';
import { CommonResult } from 'with-jwt/src/core/common-result';

@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) {}
    @UseGuards(LocalAuthGuard)
    @Public()
    @Post('login')
    async login(@Request() req) {
        // return req.user
        return CommonResult.Success('', await this.authService.login(req.user));
    }

    @Post('logout')
    logout(@Request() req) {
        console.log(req.user);
    }

    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        const result = await this.userService.create(createUserDto);
        if (!result.data) {
            return CommonResult.Failed(result.message, null);
        }
        const { password, ...userDto } = result.data;
        return CommonResult.Success(result.message, userDto);
    }

    @UseGuards(GithubAuthGuard)
    @Get('github')
    @Public()
    async auth(@Request() req) {
        return passport.authenticate('github');
    }

    @Get('callback')
    @Public()
    async callback(@Request() req: Request, @Query() query) {
        axios
            .request({
                baseURL: 'https://github.com',
                url: '/login/oauth/access_token',
                method: 'POST',
                data: {
                    client_id: 'xxxxx',
                    client_secret: 'xxxx',
                    code: query['code'],
                    // redirect_uri:'http://localhost:3200/api/'
                },
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'axios 0.21.1',
                },
            })
            .then((resp) => {
                const respData = resp.data;
                console.log(respData);
            })
            .catch((error) => console.log(error));
        return query;
    }
}
