import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { response, type Request, type Response } from 'express';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { ValidateCreateUserPipe } from '../../pipes/validate-create-user/validate-create-user.pipe';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Get() 
    fetchUsers() {
        return this.userService.fetchUsers();
    }

    @Get()
    getUsers() {
        return [{
            userName: 'Om',
            email: 'Om@gmail.com'
        }];
    }

    // @Post()
    // createUsers(@Req() request: Request, @Res() response: Response) {
    //     const data = request.body;
    //     response.send("");
    // }

    @Post('create')
    @UsePipes(new ValidationPipe())
    createUser(@Body(ValidateCreateUserPipe) userData: CreateUserDto) {
        console.log(userData);
        return this.userService.createUser(userData);
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        console.log(id);
        response.send("");
    }

    @Get(':id')
    getuser(@Param('id', ParseIntPipe) id: number) {
        console.log(id);
        return('')
    }

    @Get()
    getUser(@Query('name') name: string) {
        console.log(name);
        return;
    }
}
