import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { FortyTwoGuard, JwtGuard } from 'src/auth/guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ JwtModule.register({}) ],
  providers: [UserService, FortyTwoGuard],
  controllers: [UserController]
})
export class UsersModule {}
