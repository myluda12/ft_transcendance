import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}
    canActivate( context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{
        const verifyOptions = { secret: this.config.get('JWT_SECRET') };
        const request = context.switchToHttp().getRequest();
        const jwt_token = request.cookies['access_token'];
        try{
            const user_obj = this.jwtService.verify(jwt_token, verifyOptions);
            request.user_obj = user_obj;
            return user_obj ? true : false;
        }
        catch{
            throw new HttpException("Invalid access token!", HttpStatus.UNAUTHORIZED);
        }
    }
}

// res.cookie('token', '', { expires: new Date() });