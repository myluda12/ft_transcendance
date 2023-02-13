import { HttpException, Injectable, Param, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { authenticator } from "otplib";
import { PrismaService } from "src/prisma/prisma.service";
import { UserStatus } from "@prisma/client";

import { toDataURL } from 'qrcode';
import { toFileStream } from 'qrcode';
import { throwError } from "rxjs";
import { UserDto } from "src/user/dto";
@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService, private config: ConfigService, private jwt: JwtService){
    }
    
    async login(@Req() req, @Res() res){
        try{
            const payload = {
                id: req.user.id,
            };
            const nb_user : number = await this.prisma.user.count({
                where:{
                    id: req.user.id,
                }
            });
            const zero : number = 0;
            if (nb_user === 0){
                const user = await this.prisma.user.create({
                    data : {
                        id: req.user.id,
                        full_name: req.user.full_name,
                        username: req.user.username,
                        avatar: req.user.avatar,
                        is_two_fa_enable: false,
                        email: req.user.email,
                        status: UserStatus.ON,
                        win : 0,
                        lose: 0,
                        score: 0,
                        win_streak: 0,
                    }
                });
                const secret = this.config.get('JWT_SECRET');
                const access_token = await this.jwt.sign(payload, {
                    expiresIn : '1d',
                    secret : secret,
                });
                res.cookie('access_token', access_token, { httpOnly: true }).status(200);
                // res.json({message :"success!"});
                req.res.redirect(this.config.get('LOCAL_URL'));
            }
            else if (nb_user === 1){
                const user = await this.prisma.user.findUnique({
                    where:{
                        id : req.user.id,
                    }
                });
                const secret = this.config.get('JWT_SECRET');
                const access_token = await this.jwt.sign(payload, {
                    expiresIn : '1d',
                    secret : secret,
                });
                if (user.is_two_fa_enable) {
                    req.res.redirect(this.config.get('LOCAL_URL') + "verify_2fa/" + user.id);
                }
                else {
                    res.cookie('access_token', access_token, { httpOnly: true }).status(200);
                    // res.send(access_token);
                    // res.json({message :"success!"});
                    await this.prisma.user.update({
                        where: {id: user.id },
                        data: {
                            status: UserStatus.ON,
                        }
                    });
                    // if (user.is_two_fa_enable === true)
                    //     req.res.redirect(this.config.get('LOCAL_URL') + "verify_2fa");
                    // else
                        req.res.redirect(this.config.get('LOCAL_URL'));

                }
                
            }
        }
        catch{
            throw new HttpException("Login failed!", 400);
        }
    }

    async generate_2fa_secret(user_req: UserDto, @Res() res)
    {
        try{
            const user = await this.get_user(user_req.id);
            // console.log(user);
                this.enable_2fa(user, res);
                const secret = authenticator.generateSecret();            
                const otpauthUrl : string = authenticator.keyuri(user.email, this.config.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
                this.save_secret_db(user, secret);
                return ({
                    secret,
                    otpauthUrl
                })
        }
        catch{
            throw new HttpException("User not found!", 400);
        }
    }
    async save_secret_db(user, secret : string) {
        const updated_user = await this.prisma.user.update({
            where: {id: user.id },
            data: {
                two_fa_code: secret,
            }
          });
    }
    async generate_qr_code(user_obj, @Res() res) {
        const {otpauthUrl} = await this.generate_2fa_secret(user_obj, res);
        return toFileStream(res, otpauthUrl);
    }

    async enable_2fa(user_req, @Res() res){
        try{
            const user = await this.get_user(user_req.id);
            if (user.is_two_fa_enable === true)
            {
                throw new HttpException("2FA Already Enabled!", 400);
            }                
            else{
            const updated_user = await this.prisma.user.update({
                where: {id: user.id },
                data: {
                    is_two_fa_enable: true,
                }
             });
            }
        }
        catch{
            throw new HttpException("Failed to enable 2fa!", 400);
        }
    }
    async disable_2fa(user_req: UserDto, @Res() res){
        try{
            const user = await this.get_user(user_req.id);
            if (user.is_two_fa_enable === false)
            {
                throw new HttpException("2FA Already Disabled!", 400);
             //   res.json({message :"2fa is already disabled!"});
            }
            else{
                const updated_user = await this.prisma.user.update({
                    where: {id: user.id },
                    data: {
                        is_two_fa_enable: false,
                    }
                  });
                  res.json({message :"success!"});
            }
        }
        catch{
            throw new HttpException("Failed to disable 2fa!", 400);
        }
    }
    async verify_2fa(@Param() param, @Res() res){
        
        const user = await this.get_user(param.userId);
        
        if (user.is_two_fa_enable === false){
            throw new HttpException("2fa is not enable!", 400);
        }
        const is_2fa_code_valid =  authenticator.verify({
            token: param.two_fa_code,
            secret: user.two_fa_code,
        });
        if (!is_2fa_code_valid) {
            throw new HttpException("Invalid 2fa code!", 400);
        }
        await this.prisma.user.update({
            where: {id: user.id },
            data: {
                status: UserStatus.ON,
            }
          });
        const payload = {
            id: user.id,
        };
        const secret = this.config.get('JWT_SECRET');
        const access_token = await this.jwt.sign(payload, {
            expiresIn : '1d',
            secret : secret,
        });
        res.cookie('access_token', access_token, { httpOnly: true });
        res.json({message :"2fa code is valid!"});
    }
    async get_user(req_id: string){
        const user = await this.prisma.user.findUnique({
            where:{
                id : req_id,
            }
        });
        return user;
    }
}