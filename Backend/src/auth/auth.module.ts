import { Module } from "@nestjs/common";
import { FortyTwoStrategy } from "src/auth/strategy/FortyTwo.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule} from "@nestjs/jwt";


@Module({
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy],
  imports: [ JwtModule.register({}) ],
})
export class AuthModule {

}