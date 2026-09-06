import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/registerUser.dto.js';
import { loginDto } from './dto/loginUser.dto.js';
import { AuthGuard } from './auth.guard.js';
import { UserService } from '../user/user.service.js';
import {Request as ExpressRequest} from 'express';

interface AuthenticatedRequest extends ExpressRequest {
    user: {
        id: number;
    };
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,private readonly userService: UserService) {}

    @Post('register') 
    async register(@Body() registerUserDto: RegisterDto) {
        const token = await this.authService.register(registerUserDto);
        return token;
    }

    @Post('login')
    async login(@Body() loginUserDto: loginDto) {
        const token = await this.authService.login(loginUserDto);
        return token;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req: AuthenticatedRequest) {
        const userid = req.user.id;
        const user = await this.userService.getUserById(userid);
        return user;
    }
}
