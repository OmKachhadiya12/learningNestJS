import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterDto } from './dto/registerUser.dto.js';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/loginUser.dto.js';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService,private readonly jwtService: JwtService) {}

    async register(registerUserDto: RegisterDto) {

        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserDto.password,saltRounds);

        const user = await this.userService.createUser({...registerUserDto,password: hash});

        const payload = {id: user.id};

        const token = await this.jwtService.signAsync(payload);

        return {access_token: token};
    }

    async login(loginUserDto: loginDto) {
        const user = await this.userService.checkUser(loginUserDto);

        const payload = {id: user.id};

        const token = await this.jwtService.signAsync(payload);

        return {access_token: token};
    }
}
