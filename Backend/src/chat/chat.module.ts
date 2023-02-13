import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { RoomsController } from './chat.controller';

//import { ChatController } from './chat.controller';

@Module({
  imports: [PrismaModule, JwtModule, UsersModule],
  providers: [ChatGateway, ChatService, UserService, ConfigService],
  controllers: []
})
export class ChatModule {}
