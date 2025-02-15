import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from 'src/common/common-interfaces';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    example: "john@yopmail.com",
                    description: "Provide unique username"
                },
                password: {
                    type: 'string',
                    example: "John1234",
                    description: "Provide min 8 digit password"
                }
            }
        }
    })
    signUp(@Body() signUpDto: SignUpDto): Promise<void> {
        return this.authService.signup(signUpDto);
    }

    @Post('/login')
    @ApiBody({
        schema: {
            type: 'object',
            properties : {
                username: {
                    type: "string",
                    example: 'john@yopmail.com'
                },
                password: {
                    type: 'string',
                    example: 'John1234'
                }
            }
        }
    })
    login(@Body() loginDto : LoginDto) : Promise<LoginResponse> {
        return this.authService.login(loginDto);
    }
}
