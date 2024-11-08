import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SinupDto } from './dto/sinup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

@Post("/sinup")
    async sinup(@Body() sinupDto:SinupDto):Promise<{token:string}>{
      return this.authService.sinup(sinupDto);




    }

    @Get('/login')
    async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(loginDto);
        }
        
}
