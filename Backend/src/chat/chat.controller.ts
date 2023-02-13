import { Controller, Post, Body, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { RoomData } from './dto/createroom.dto';
import { PrismaClient } from '@prisma/client';
import { ChatService } from './chat.service' ;
import { GetBucketCorsRequestFilterSensitiveLog } from '@aws-sdk/client-s3';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
const prisma = new PrismaClient();




@Controller('chat')
export class RoomsController {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) {}
  private chatservice : ChatService;
  // private prismaService: PrismaService;
  // private jwtService: JwtService;

  
  //post createroom   //createanewroom
  // @Post('createRoom')
  // async CreateRoom(@Req() req, @Body() roomData : RoomData, @Res() res) {

  //   let membersObj = JSON.parse(roomData['members']);

  //   if (roomData['type'] === 'protected' && roomData['password'] === undefined)
  //     return res.status(HttpStatus.BAD_REQUEST).send({'message': "Password Required"});
  //       if (roomData['type'] === 'protected' && roomData['password'] !== undefined)
  //           return this.chatservice.CreateRoom(req.user.userId, roomData['name'], roomData['type'], membersObj, roomData['password'], res);
  //       return this.chatservice.CreateRoom(req.user.userId, roomData['name'], roomData['type'], membersObj, null, res);
  // }

  //get allrooms //get all rooms except private rooms

  //get myrooms   // get all rooms i have joined

  //get messagesinroom // get messages in specific room


  //post joinroom     //join a new room

  //post leaveroom    //leave a room


  //post updateroomaccess //change a room type(public, private, protected)

  //post updaterestriction // ban, mute or kick user in specific room

  //post updaterole // update a user role in specific room




}

