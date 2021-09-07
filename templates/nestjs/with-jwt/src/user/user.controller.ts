import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommonResult } from 'with-jwt/src/core/common-result';
import { Public } from 'with-jwt/src/auth/constrants';
import { AuthService } from 'with-jwt/src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly accountService: UserService,
    // 避免循环引用
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    const page = query['page'];
    const count = query['count'];
    const [accounts, totalCount] = await this.accountService.findAll(
      page,
      count,
    );
    const _accounts = accounts.map((account) => {
      const { password, ...other } = account;
      return other;
    });
    return CommonResult.Success('', {
      accounts: _accounts,
      totalCount,
    });
  }

  @Get('/profile/')
  async profile(@Request() req) {
    const user = await this.accountService.findOne(req.user.userId);
    if (user) {
      return CommonResult.Result(HttpStatus.OK, '', user);
    }
    return CommonResult.Failed('Not found', user);
  }

  @Post('/profile/:id')
  async updateProfile(@Request() req, @Param('id') userId) {
    const user = await this.accountService.findOne(req.user.userId);
    if (user) {
      return CommonResult.Result(HttpStatus.OK, '', user);
    }
    return CommonResult.Failed('Not found', user);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const user = await this.accountService.findOne(+id);
    return CommonResult.Success('', user);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!id) {
      const userId = req.user.userId;
      if (!userId) {
        return CommonResult.Failed('用户未授权', null);
      }
      console.log(updateUserDto);
      return this.accountService.update(+userId, updateUserDto);
    }
    return this.accountService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.accountService.create(createUserDto);
  }
}
