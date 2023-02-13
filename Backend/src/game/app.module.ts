import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { JwtGuard } from 'src/auth/guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, JwtModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, UserService, ConfigService],
})
export class GameModule {
  
}
