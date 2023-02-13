import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

import { PrismaService } from "src/prisma/prisma.service";
import { ACCESS} from '@prisma/client';
import { Server, Socket } from "socket.io";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService){
  }

    async CreateRoom(me: string, roomname: string, type: string,
        members: string[], password: string, server: Server, client: Socket) {
        let access = null;
        if (type === 'private')
            access = ACCESS.PRIVATE
        else if (type === 'public')
            access = ACCESS.PUBLIC
        else if (type === 'protected')
            access = ACCESS.PROTECTED
        else if (type === 'direct')
            access = ACCESS.DM //TODO:Must change to DM 
        else
          return  client.emit('roomnotcreated', roomname);

        if (password !== null &&  password !== undefined) {
            password = password; //TODO: must encrypt password 
        }
        let channel = await this.prisma.room.create({
            data: {
                type: access,
                name: roomname,
                password: password
            }
        });

        //TODO: Must update chatroom members 
        //server.emit('roomcreated', roomname);
        client.emit('roomcreated', roomname);
    }

    // get an object of all rooms except private rooms
    async GetFilteredRooms(user: string, server: Server, client: Socket) {

    }

    // get an object of all the User's DMs 
    async GetAllDMs(user: string, server: Server, client: Socket) {
        
    }

    // get an object of all messages in specific room
    async GetAllRoomMessages(user: string, roomid: string, server: Server, client: Socket) {
            
    }

}
