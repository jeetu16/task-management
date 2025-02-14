import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2'
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ) {}

    async signup(signUpDto : SignUpDto) : Promise<void> {
        const { password } = signUpDto;
        let user = this.userRepository.create({
            ...signUpDto,
            password: await argon2.hash(password)
        })
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if(error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async login(loginDto : LoginDto) : Promise<string> {
        const user = await this.userRepository.findOne({
            where : {
                username: loginDto?.username
            }
        })
    
        if(user && await argon2.verify(user.password, loginDto.password)) {
            return "Success"
        } else {
            throw new BadRequestException("Invalid email or password");
        }
    }
}
