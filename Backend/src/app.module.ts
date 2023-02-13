import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { UserService } from './user/user.service';
import { GameModule } from './game/app.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    GameModule,
    PrismaModule,
    ChatModule,
    JwtModule,
  ],
  providers: [AppGateway, UserService, ConfigService]
})
export class AppModule {}


// # Environment variables declared in this file are automatically made available to Prisma.
// # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

// # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
// # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

// DATABASE_URL="postgresql://user:password@localhost:5434/nest_db?schema=public"

// # CLIENT_ID="u-s4t2ud-1b6b8de5a6ea0d587f46ed108a448d7aa0fabd3e73526f770feda12b43b5fe43"
// # CLIENT_SECRET="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"
// CLIENT_ID="u-s4t2ud-43c0dd658837a1d14075388a8c39e3b291d160da8083481ecbb668434b40b22d"
// CLIENT_SECRET="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"
// CALLBACK_URL="http://10.12.3.2:3000/auth/login"

// JWT_SECRET="secret-password"

// TWO_FACTOR_AUTHENTICATION_APP_NAME="Peacover_APP"

// AWS_REGION="us-east-1"
// AWS_ACCESS_KEY_ID="AKIASJGB55FC4LCV7VH5"
// AWS_SECRET_ACCESS_KEY="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"
// AWS_BUCKET_NAME="peacoverawsbucket"