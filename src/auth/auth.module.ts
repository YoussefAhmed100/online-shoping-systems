import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:"jwt"}),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return {
          secret:config.get<string>('JWT_SECRET'),
          signOptions:{
            expiresIn:config.get<string |number>('JWT_EXPIRES_IN')
            }
            }
      }
    }),
    MongooseModule.forFeature([{name:"User",schema:UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,
    {  
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports:[PassportModule,JwtModule]

})
export class AuthModule {}
