import { Injectable} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { Strategy, Profile, VerifyCallback } from 'passport-42/lib';
import { ConfigService } from "@nestjs/config";

@Injectable ()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private prisma: PrismaService, private config: ConfigService){
        super({
            clientID: config.get('CLIENT_ID'),
            clientSecret: config.get('CLIENT_SECRET'),
            callbackURL: config.get('CALLBACK_URL'),
            passReqToCallback: true,
        })
    }
    async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, cb: VerifyCallback) : Promise<any> {
        // console.log(profile);
        // const user = await this.prisma.user.create({
        //     data : {
        //         id: profile.id,
        //         username: profile.username,
        //         full_name: profile.displayName,
        //         avatar: profile.photos[0].value,
        //         is_two_fa_enable: false,
        //         first_time: true,
        //         email: profile.emails[0].value,
        //         // add email
        //     }
        // });
        const user = {
            id: profile.id,
            username: profile.username,
            full_name: profile.displayName,
            // avatar: profile.photos[0].value,
            avatar : profile._json.image.link,
            email: profile.emails[0].value,
        };
        // req['user'] = user;
        // console.log(user);
        return user;
    }
}