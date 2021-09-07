import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { CommonResult } from 'with-jwt/src/core/common-result';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private accountRepo: Repository<User>,
    ) {}

    async findOneByUsername(username: string, pwd: string) {
        const user = await this.accountRepo.findOne({
            username: username,
        });
        if (user !== null && user) {
            return user
        } else {
            return null;
        }
    }

    async create(createUserDto: CreateUserDto): Promise<CommonResult> {
        const saltRounds = 10;

        const { username, password, email } = createUserDto;
        if (!email) {
            return CommonResult.Failed('注册邮箱为空', null);
        }
        const existUser = await this.accountRepo.findOne({
            username: username,
        });
        if (existUser) {
            return CommonResult.Failed('该用户名已经被占用,注册失败', null);
        }
        const existUser2 = await this.accountRepo.findOne({
            email: email,
        });
        if (existUser2 !== null && existUser2) {
            return CommonResult.Failed('邮箱已经被占用', null);
        }
        createUserDto.password = bcrypt.hashSync(
            createUserDto.password,
            saltRounds,
        );
        const newUser = await this.accountRepo.save(createUserDto);
        return CommonResult.Success('注册成功', newUser);
    }

    findAll(page: number, count: number) {
        return this.accountRepo.findAndCount({
            skip: (page - 1) * count,
            take: count,
        });
    }

    async findOne(id: number) {
        const user = await this.accountRepo.findOne(id);
        const { password, ...info } = user;
        return { ...info };
    }

    async findOneById(id: number) {
        const user = await this.accountRepo.findOne(id);
        const { password, ...info } = user;
        return { ...info };
    }
    async update(id: number, updateAccountDto: UpdateUserDto) {
        const user = await this.findOne(id);
        const newUser = { ...user, ...updateAccountDto };
        return this.accountRepo.save(newUser, {});
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        return this.accountRepo.delete(user);
    }
}
