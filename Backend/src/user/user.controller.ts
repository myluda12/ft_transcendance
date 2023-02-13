import { Body, Controller, Get, Post, Put, Param, Req, UseGuards, Res, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, Patch } from '@nestjs/common';
import { FortyTwoGuard, JwtGuard } from 'src/auth/guard';
import { LocalAuthGuard } from './guard';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('user')
@UseGuards(LocalAuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @UseGuards(JwtGuard)
    @Get('/')
    signin(@Req() req){
        return req.user_obj;
    }

    @UseGuards(JwtGuard)
    @Post('edit_full_name/:new_full_name') 
    change_full_name(@Req() req, @Param('new_full_name') new_full_name : string, @Res() res){
        // console.log(req);
        return this.userService.change_full_name(req.user_obj, new_full_name, res);
    }
    
    @UseGuards(JwtGuard)
    @Get('user')
    get_user(@Req() req, @Res() res){     
        return this.userService.get_user_all(req.user_obj, res);
    }

    @UseGuards(JwtGuard)
    @Get('me')
    get_me(@Req() req, @Res() res){     
        return this.userService.get_me(req.user_obj, res);
    }
    
    @UseGuards(JwtGuard)
    @Get('user_score')
    get_user_score(@Req() req, @Res() res){
        return this.userService.get_user_score(req.user_obj, res);
    }
    
    @UseGuards(JwtGuard)
    @Post('logout')
    logout(@Req() req, @Res({ passthrough: true }) res){
        this.userService.edit_user_status(req.user_obj, UserStatus.OFF);
        res.clearCookie('access_token');
    }
    
    @UseGuards(JwtGuard)
    @Post('in_queue')
    edit_user_status(@Req() req){
        return this.userService.edit_user_status(req.user_obj, UserStatus.INQUEUE);
    }
    
    @UseGuards(JwtGuard)
    @Get('achievements')
    get_user_achievements(@Req() req, @Res() res){
        return this.userService.get_user_achievements(req.user_obj, res);
    }
    
    @UseGuards(JwtGuard)
    @Get('leaderboard')
    get_leaderboard(@Res() res){
        return this.userService.get_leaderboard(res);
    }
    
    @UseGuards(JwtGuard)
    @Get('friends')
    get_user_friends(@Req() req, @Res() res){
        return this.userService.get_user_friends(req.user_obj, res);
    }
    
    @UseGuards(JwtGuard)
    @Post('add_friend/:friend_name') // friend username is passed as a param
    add_friend(@Req() req, @Param() param, @Res() res){
        return this.userService.add_friend(req.user_obj, param.friend_name, res);
    }
    
    @UseGuards(JwtGuard)
    @Post('remove_friend/:friend_name')
    remove_friend(@Req() req, @Param() param, @Res() res){
        return this.userService.remove_friend(req.user_obj, param.friend_name, res);
    }
    
    @UseGuards(JwtGuard)
    @Post('block_friend/:friend_name')
    block_friend(@Req() req, @Param() param, @Res() res){
        return this.userService.block_friend(req.user_obj, param.friend_name, res);
    }

    @UseGuards(JwtGuard)
    @Post('unblock_friend/:friend_name')
    unblock_friend(@Req() req, @Param() param, @Res() res){
        return this.userService.unblock_friend(req.user_obj, param.friend_name, res);
    }
    
    @UseGuards(JwtGuard)
    @Get('get_friends')
    get_friends(@Req() req, @Res() res){
        return this.userService.get_friends(req.user_obj, res);
    }

    @UseGuards(JwtGuard)
    @Get('get_history/:username')
    get_history(@Req() req, @Param() param, @Res() res){
        return this.userService.get_history(req.user_obj,param.username, res);
    }

    @UseGuards(JwtGuard)
    @Get('status_friend/:friend_name')
    status_friend(@Req() req, @Param() param, @Res() res){
        return this.userService.status_friend(req.user_obj, param.friend_name, res);
    }
    
    @UseGuards(JwtGuard)
    @Get('user/:whichone')
    async get_which_one(@Req() req, @Param() param, @Res() res)
    {
        return this.userService.get_which_friend(req.user_obj, param.whichone ,res);
    }

    // @Get('user/id/:username')
    // async get_user_by_id(@Req() req, @Param() param, @Res() res)
    // {
    //     return this.userService.get_user_by_id(req.user_obj, param.username ,res);
    // }
    
    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@Req() req, @UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({
            fileType: '.(png|jpeg|jpg|gif|svg|bmp|webp)',
        })
        .addMaxSizeValidator({
            maxSize: 10 * 1000000,
        })
        .build({
            errorHttpStatusCode: HttpStatus.UNAUTHORIZED,
        }),
        ) file) {
            return await this.userService.upload(req.user_obj, file);
        }
        // edit username: DONE!
        // edit avatar: DONE!
        // leaderboard: DONE!
        // history games: DEPENDS ON GAME
        // achievements: DONE!
        // add friends: DONE!
        // stats of friends: DONE!
        // calcul of score: DONE!
        
        
        //add friend in both relations && post req
    }