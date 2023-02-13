import { Controller, Get, Param, Post, Req, Res, UseFilters, UseGuards} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FortyTwoGuard, HttpExceptionFilter, JwtGuard } from "src/auth/guard";
import { AuthService } from "./auth.service";
import { ApiTags } from '@nestjs/swagger';
import { UserStatus } from "@prisma/client";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @UseGuards(FortyTwoGuard)
    @UseFilters(new HttpExceptionFilter())
    @Get('login')
    login(@Req() req, @Res() res) {
        return this.authService.login(req, res);
    }

    @UseGuards(JwtGuard)
    @Get('login/2fa/enable')
    async generate_qr_code(@Req() req, @Res() res) {
        return (this.authService.generate_qr_code(req.user_obj, res));
    }

    @UseGuards(JwtGuard)
    @Post('login/2fa/disable')
    disable_2fa(@Req() req, @Res() res) {
        return this.authService.disable_2fa(req.user_obj, res);
    }
    // @Get('logout')

    // @UseGuards(JwtGuard)
    @Post("login/2fa/:two_fa_code/:userId")
    verify_2fa(@Param() param, @Res() res) {
        return this.authService.verify_2fa(param,res);
    }

}
