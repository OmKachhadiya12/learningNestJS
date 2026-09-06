import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/registerUser.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { loginDto } from '../auth/dto/loginUser.dto.js';
import bcrypt from "bcrypt";

@Injectable()
export class UserService {

    constructor(@InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(registerUserDto: RegisterDto) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: {
                    email: registerUserDto.email,
                },
            });

            if (existingUser) {
                throw new ConflictException(
                    'User with this email already exists.',
                );
            }

            const user = this.userRepository.create({
                fname: registerUserDto.fname,
                lname: registerUserDto.lname,
                email: registerUserDto.email,
                password: registerUserDto.password,
            });

            return await this.userRepository.save(user);

        } catch (error) {
            console.log(error);

            if (error instanceof ConflictException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Something went wrong while creating the user.',
            );
        }
    }

    async checkUser(loginUserDto: loginDto) {
        try{
            const existingUser = await this.userRepository.findOne({
                where: {
                    email: loginUserDto.email,
                }
            })

            if(!existingUser) {
                throw new ConflictException("Email not exist.")
            }

            const checkPassword = await bcrypt.compare(loginUserDto.password,existingUser.password);

            if(!checkPassword) {
                throw new BadRequestException("Password is incorrect.")
            }

            return existingUser;

        } catch(error) {
            console.log(error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Something went wrong while creating the user.',
            );
        }
    }

    async getUserById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id: id
            },
        });
    }
}
