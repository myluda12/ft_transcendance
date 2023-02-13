import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from "socket.io";
import { Logger, PayloadTooLargeException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getFromContainer } from 'class-validator';
import { Prisma, Role } from '@prisma/client';
import { emit } from 'process';
import { access } from 'fs';
import { DeleteBucketReplicationCommand } from '@aws-sdk/client-s3';
import * as bcrypt from 'bcrypt';



enum NOTIF_STATUS {
  FAILED = 'Failed',
  SUCCESS = 'Success',
  UPDATE = 'Update',
  RESTRICTED = 'Restricted',
}

enum RESTRICTION {
  BAN = 'BAN',
  KICK = 'KICK',
  MUTE = 'MUTE',
}

enum MUTEDURATION {
  FIFTEENSEC = 30000,
  FIVEMIN = 300000,
  ONEHOUR = 3600000,
}

enum ACCESS {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  DM = 'DM'
}

enum ROLE {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}



interface userSocket {
  username: string;
  socket: Socket;
  currentroom: string;
}

class userSocket {
  constructor(userid: string, socket: Socket) {
    this.username = userid;
    this.socket = socket;
    this.currentroom = '';
  }
  setroom(room: string) {
    this.currentroom = room;
  }
  getroom(): string {
    return this.currentroom;
  }
  getsocket(): Socket {
    return this.socket
  }
  getusername(): string {
    return this.username;
  }
}


interface notification {
  status: string;
  statuscontent: string
}

class notification {
  constructor() {
    this.status = '';
    this.statuscontent = '';
  }
  setStatus(status: string) {
    this.status = status;
  }

  getStatus(): string {
    return this.status;
  }

  setStatusContent(statuscontent: string) {
    this.statuscontent = statuscontent;
  }
  getStatusContent() {
    return this.statuscontent;
  }

  getNotification() {
    let data = {
      status: this.status,
      statuscontent: this.statuscontent,
    };
    return data;
  }
}

/*
  // TOADD: payloads interfaces and classes
*/

interface Message {
  id: number;
  sender: string;
  messagecontent: string;
  time: Date;
  profile: string;
}

@WebSocketGateway(4000, {
  cors: {
    credentials: true,
    origin: 'http://10.12.3.2:3000',
  },
  namespace: 'chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) { }
  private server: Server;
  private logger: Logger = new Logger("ChatGateway");
  private chatservice: ChatService;

  //TODO: an array of the connected sockets
  private userSocketMap: Array<userSocket> = Array<userSocket>();



  afterInit(server: Server) {
    this.server = server;
    this.logger.log("INITIALIZED")
  }

  async handleConnection(client: Socket) {
    try {
     
    } catch (error) {

    }
  }


  @SubscribeMessage('connectpls')
  async connect(client: Socket) {

   
    try {
      const user = await this.getUserFromSocket(client);


      let index = this.userSocketMap.findIndex(e => e.username == user.username);
      if (index != -1) {
        this.userSocketMap.splice(index, 1);
      }
      this.userSocketMap.push(new userSocket(user.username, client));

      let sentpayload = {
        payload: {
          username: user.username,
          id: user.id,
          fullname: user.full_name,
          profile: user.avatar,
        }
      };
      client.emit('connection', sentpayload);
      this.updateAllSocketRooms(client);


      const blocked = await this.getBlockedUsers(user.id);
      // console.log(blocked);
      client.emit('getblocked', blocked);
    } catch (error) {

    }
  }

  handleDisconnect(client: Socket) {
    // console.log("client has disconnected ");

    // TODO: remove the client from connected_clients_array
    let index = this.userSocketMap.findIndex(e => e.socket == client);
    this.userSocketMap.splice(index, 1);
  }

  @SubscribeMessage('leave')
  async handleLeave(client: Socket, payload: any) {
    try {
      const user = await this.getUserFromSocket(client);
      const room = await this.getRoomByRoomId(payload.roomid);
    

      client.leave(payload.roomid.toString());
      const deleteroomuser = await this.prismaService.roomUser.delete({
        where: {
          Room_id_user_id: {
            Room_id: room.id,
            user_id: user.id,
          }
        },
      })

      let msg = user.username + ' has left the room!'
      this.sendMessageToSocketRoom(payload.roomid, 'Server', msg, 'ServerAvatar.png');

      client.emit('requestroomsupdate');
      client.emit('chatclear');
    } catch (error) {

    }



    // TODO: if client is owner, assign owner role to another random memeber
    // TODO: if the client is the only memeber in the room, delete the room from the database

    // TODO:  remove the user from the selected room from user_chats table

    // TODO: notify all the rooms memebers clients by sending ([UserName] has left the chat)

    // TODO: add the sent message to database

  }

  @SubscribeMessage('createroom')
  async create_room(client: Socket, payload: any) {



    // this.rooms.push(new IRoom(this.roomcount++, payload.name, payload.access, payload.password, user.username))

    // TODO: check the new room type

    // TODO: get the new memebers and put them in (array or objects, still havent decided yet)

    // TODO: create the new room in the data base

    // TODO: add the members database

    // TODO: set the the room creator as owner

    // TODO: if the created room is public or protected 
    // TODO: notify all the server clients to update thier room list in the frontend

    try {
      const user = await this.getUserFromSocket(client);


      let pass: string = '';
      if (payload.access == ACCESS.PROTECTED) {
        pass = await bcrypt.hash(payload.password, 10);
      }
      const room = await this.prismaService.room.create({
        data: {
          name: payload.name,
          type: payload.access,
          password: pass,
        }
      });
      const roomuser = await this.prismaService.roomUser.create({
        data: {
          user_id: user.id,
          Room_id: room.id,
          role: Role.OWNER,
          is_banned: false,
          mute_time: new Date(),
        }
      });


      room['joined'] = true;
      let sentpayload = {
        payload: {
          room: room,
        }
      }



      client.emit('roomcreate', sentpayload);

      this.server.emit('requestroomsupdate');

      const roominfo = {
        // profile: 'hgrissen.jpeg',//props.room.profile,
        roomname: room.name,
        lastmessage: 'hello',//props.room.lastmessage,
        lastmessagedate: '',
        id: room.id,
        type: room.type,
        joined: true,
        password: '',
      }
      this.enterroom(client, roominfo)
    }
    catch {
      // console.log('room cant be created');
    }



  }


  @SubscribeMessage('joinroom')
  async handleJoin(client: Socket, payload: any) {
    try {
      const room = await this.getRoomByRoomId(payload.id);
      const user = await this.getUserFromSocket(client);
      if (room.type == ACCESS.PROTECTED && await bcrypt.compare(payload.password, room.password) == false) {
        client.emit('roomjoinerror', { message: 'wrong password!' });
        return;
      }
      const roomuser = await this.prismaService.roomUser.create({
        data: {
          user_id: user.id,
          Room_id: room.id,
          role: Role.MEMBER,
          is_banned: false,
          mute_time: new Date(),
        }
      });
      client.emit('roomjoin', roomuser);

      const roominfo = {
        // profile: 'hgrissen.jpeg',//props.room.profile,
        roomname: room.name,
        lastmessage: '',//props.room.lastmessage,
        lastmessagedate: '',
        id: room.id,
        type: room.type,
        joined: true,
        password: '',
      }

      client.emit('requestroomsupdate');

      let msg = user.username + ' has joined the room!'
      this.sendMessageToSocketRoom(payload.id, 'Server', msg, 'ServerAvatar.png');

      this.enterroom(client, roominfo)

    } catch (error) {
      client.emit('roomjoinerror', { message: 'try again later!' });
    }


    // TODO: check if the client has permission to join
    // TODO: if not notify the client with the reason why
    // client.emit('roomjoin', payload.room);

    // TODO: add the client user in the selected room table


    // TODO: notify all the room memebers clients by sending ("[UserName] has joined the room") message

    // TODO: add the sent message("[UserName] has joined the room") to database

    // client.emit('joined', payload.room);


    // TODO: enter the room
    // leave old room
    // join new room
  }


  @SubscribeMessage('recievemessage')
  async messagerecieved(client: Socket, payload: any) {


    try {
      const user = await this.getUserFromSocket(client);

      const roomuser = await this.getRoomUser(payload.roomid, user.id);

      if (roomuser.mute_time.getTime() > Date.now() || roomuser.is_banned)
        return;


      let newmesg = { sender: user.username, messagecontent: payload.message, profile: user.avatar };

     
      this.server.to(payload.roomid.toString()).emit('messagerecieve', newmesg);



      let room = await this.getRoomByRoomId(payload.roomid);

      const msguser = await this.prismaService.messageUser.create({
        data: {
          room_id: room.id,
          user_id: user.id,
          content: payload.message,
          avatar: user.avatar,
          username: user.username,
        }
      })

    } catch (error) {

    }


    // TODO: check if user mute ((currentTimeStamp - user.muteTimeStamp) > user.muteDuration)
    //client.emit('mute', 'muted')

    // TODO: send message to all sockets actaully in the room

    // TODO: add the message in the data base


    // retrieve all messages
    //this.enterroom(client, payload);
  }

  // client has selected a room in frontend {MIGHT CHANGE TO BE INCLUDED IN JOINROOM}
  @SubscribeMessage('enterroom')
  async enterroom(client: Socket, payload: any) {
    const room = await this.getRoomByRoomId(payload.id);
    const user = await this.getUserFromSocket(client);

    const roomuser = await this.prismaService.roomUser.findMany({
      where: {
        AND: [
          {
            user_id: user.id
          },
          {
            Room_id: room.id
          },
        ],
      },
    })

    if (roomuser[0].is_banned) {
      return;
    }


    if (room.type == ACCESS.DM)
    {
      const names =  room.name.split(' - ');
      const otherusername = (names[0] == user.username) ? names[1] : names[0];
      room.name = otherusername;
      const otheruser = await this.getUserByUserName(otherusername);
      room['profile'] = otheruser.avatar;
    }

    const msgs = await this.getAllMessagesByRoomId(room.id, user.id);


    const sentpayload = {
      room: room,
      messages: msgs,
    }

    room['role'] = roomuser[0].role;

    let index = this.userSocketMap.findIndex(e => e.getusername() == user.username);
    client.leave(this.userSocketMap[index]?.getroom());
    this.userSocketMap[index]?.setroom(room.id.toString());
    client.join(room.id.toString());


    client.emit('roomenter', sentpayload);
  }

  // user has added another user to a room
  @SubscribeMessage('invite')
  async inviteusertoroom(client: Socket, payload: any) {
    let notif: notification = new notification();
    var sentpayload = {
      notification: {},
      payload: null,
    };




    try {

      const updator = await this.getUserFromSocket(client);
      const updatorroomuser = await this.getRoomUser(payload.roomid, updator.id);

      if ((updatorroomuser.role != ROLE.OWNER && updatorroomuser.role != ROLE.ADMIN) || updatorroomuser.chat.type == ACCESS.DM) {
        // notif.setStatus(NOTIF_STATUS.FAILED);
        // notif.setStatusContent('Permission Denied');
        // sentpayload.notification = notif.getNotification();
        // client.emit('invited', sentpayload);
        return;
      }

      const inviteduser = await this.getUserByUserName(payload.username);
      let addedroomuser;
      if (inviteduser)
        addedroomuser = await this.getRoomUser(payload.roomid, inviteduser.id);

      if (addedroomuser || !inviteduser) {
        return;
      }


      // TODO: check client has permission to invite other users (only owner or admins can)


      // const inviteduser = await this.getUserByUserName(payload.username);


      addedroomuser = await this.prismaService.roomUser.create({
        data: {
          user_id: inviteduser.id,
          Room_id: payload.roomid,
          role: Role.MEMBER,
          is_banned: false,
          mute_time: new Date(),
        }
      });



      let msg = updator.username + ' has invited ' + inviteduser.username + ' to the room!';
      this.sendMessageToSocketRoom(updatorroomuser.Room_id, 'Server', msg, 'ServerAvatar.png');


      
      const othersocket = this.getUserSocket(payload.username);
      othersocket.emit('requestroomsupdate');

    } catch (error) {

    }

    // TODO: add the invited user in the room's database
    // TODO: add the inviteduser Message in the room's database

    // TODO: notify all clients in the room
    // TOFIX: send a message in the room 
    // notif.setStatus(NOTIF_STATUS.UPDATE);
    // notif.setStatusContent(payload.invited + ' has been invited ' + payload.access);
    // sentpayload.notification = notif.getNotification();
    // sentpayload.payload = { invited: payload.invited };
    // let roomid = this.getuserSocketRoom(payload.inviter);
    // this.server.to[roomid].emit('access_update', sentpayload);


    // TODO: notify the client
    // sentpayload.payload = null;
    // notif.setStatus(NOTIF_STATUS.SUCCESS);
    // notif.setStatusContent(payload.invited + ' has been added successfully');
    // sentpayload.notification = notif.getNotification();
    // client.emit('access_update', sentpayload);

  }

  // change a room type(public, private, protected)
  @SubscribeMessage('updateaccess')
  async updateroomaccess(client: Socket, payload: any) {

    const user = await this.getUserFromSocket(client);

    const roomuser = await this.prismaService.roomUser.findFirst({
      where: {
        AND: [
          { Room_id: payload.roomid },
          { user_id: user.id }
        ]
      },
      include: {
        chat: true,
      }
    })


    //  TODO: get user role, and room type from the database
    let updator_role = roomuser.role; //  await getUserRole(payload.updator.username, payload.roomid);
    let room_type = roomuser.chat.type; //  await getUserType(payload.roomid);

    // TODO: check client has permission for the change (only owner)
    if (updator_role !== 'OWNER' || room_type === 'DM' || room_type == payload.access) {
      return;
    }
    let pass = '';
    if (payload.access === ACCESS.PROTECTED)
      pass = await bcrypt.hash(payload.password, 10);
    const update = await this.prismaService.room.update({
      where: {
        id: roomuser.Room_id,
      },
      data: {
        type: payload.access,
        password: pass
      }
    })

    let msg = user.username + ' has changed room\'s Access type  to ' + room_type + '!';
    this.sendMessageToSocketRoom(roomuser.Room_id, 'Server', msg, 'ServerAvatar.png');


    this.server.emit('requestroomsupdate', null);

    // TODO: if new type is protected check the password
    // if (payload.access === 'protected' && payload.password == undefined) {
    //   // notif.setStatus(NOTIF_STATUS.FAILED);
    //   // notif.setStatusContent('Valid Password Required');
    //   // sentpayload.notification = notif.getNotification();
    //   // client.emit('access_update', sentpayload);
    //   return;
    // }

    // TODO: change the room access type in data base



    // TODO: notify the room clients
    // sentpayload.payload = { room: payload.room, newaccess: payload.access }
    // notif.setStatus(NOTIF_STATUS.UPDATE);
    // notif.setStatusContent(payload.room + ' is now ' + payload.access);
    // sentpayload.notification = notif.getNotification();
    // let roomid = this.getuserSocketRoom(payload.updater);
    // this.server.to[roomid].emit('access_update', sentpayload);


    // TODO: notify the client 
    // sentpayload.payload = null;
    // notif.setStatus(NOTIF_STATUS.SUCCESS);
    // notif.setStatusContent(payload.room + ' is now ' + payload.access);
    // sentpayload.notification = notif.getNotification();
    // client.emit('access_update', sentpayload);

  }

  // change a room name
  @SubscribeMessage('update_name')
  async updateroomname(client: any, payload: any) {
    let notif: notification = new notification();
    var sentpayload = {
      notification: {},
      payload: null,
    };


    //  TODO: get user role, and room type from the database
    let updator_role = 'OWNER'; //  await getUserRole(payload.updator.username, payload.roomid);
    let room_type = 'PUBLIC'; //  await getUserType(payload.roomid);

    // TODO: check client has permission for the change (owner or admins)
    // TODO: check room is not DM
    // TOFIX: 
    if (updator_role === 'member' || room_type === 'DM') {
      notif.setStatus(NOTIF_STATUS.FAILED);
      notif.setStatusContent('Permission Denied');
      sentpayload.notification = notif.getNotification();
      client.emit('name_update', { oldname: payload.oldname, newname: payload.newname });
      return;
    }

    // TODO: check new name (not empty, max lenght, min lenght...,)
    else if (payload.newname === '    ') {//TOFIX: 
      notif.setStatus(NOTIF_STATUS.FAILED);
      notif.setStatusContent('Invalid Name');
      sentpayload.notification = notif.getNotification();
      client.emit('name_update', { oldname: payload.oldname, newname: payload.newname });
      return;
    }


    // TODO: change the room name in the data base

    // TODO: notify the server sockets 
    this.server.emit('name_update', { oldname: payload.oldname, newname: payload.newname });


    // TODO: notify the client 
    sentpayload.payload = { updator: payload.updator, newname: payload.newname, oldname: payload.oldname }
    notif.setStatusContent('Name Has Been Changed Successfully');
    notif.setStatus(NOTIF_STATUS.SUCCESS);
    sentpayload.notification = notif.getNotification();
    client.emit('name_update', sentpayload);
  }

  // update a user role in specific room
  @SubscribeMessage('updaterole')
  async updateuserrole(client: any, payload: any) {
    // TODO: create empty notifationobject and empty sent object
    try {
      const user = await this.getUserFromSocket(client);
      const updateduser = await this.prismaService.user.findFirst({
        where: {
          username: payload.username
        }
      })

      const updatorroomuser = await this.prismaService.roomUser.findFirst({
        where: {
          AND: [
            { Room_id: payload.roomid },
            { user_id: user.id }
          ]
        }
      })

      const updatedroomuser = await this.prismaService.roomUser.findFirst({
        where: {
          AND: [
            { Room_id: payload.roomid },
            { user_id: updateduser.id }
          ]
        }
      })


      let updated_role = updatedroomuser.role; // await getUserRole(payload.updated.username, payload.roomid);
      let updator_role = updatorroomuser.role; //  await getUserRole(payload.updator.username, payload.roomid);

      // TODO: check if the clientUser has the required permission (owner or admin)
      if (updator_role !== Role.OWNER || payload.role === Role.OWNER || updated_role == Role.OWNER) {
        //client.emit('role_update', sentpayload);
        return;
      }

      // TODO: change the selected member role in the database
      const update = await this.prismaService.roomUser.update({
        where: {
          Room_id_user_id: {
            Room_id: updatedroomuser.Room_id,
            user_id: updatedroomuser.user_id,
          }
        },
        data: {
          role: payload.role,
        }
      })

      let msg = updateduser.username + ' is Now ' + update.role + ' !' ;
      this.sendMessageToSocketRoom(updatorroomuser.Room_id, 'Server', msg, 'ServerAvatar.png');

      return;
    } catch (error) {

    }
  }

  // ban, mute or kick user in specific room
  @SubscribeMessage('updaterestriction')
  async updaterestriction(client: Socket, payload: any) {


    const user = await this.getUserFromSocket(client);
    const roomuser = await this.getRoomUser(payload.roomid, user.id);
    const restricteduser = await this.getUserByUserName(payload.username);
    const restrictedroomuser = await this.getRoomUser(payload.roomid, restricteduser.id);



    // const restrictedroomuser = await this.getRoomUser(payload.roomid, user.id);

    // TODO:::::MUST BE FETCHED FROM DATABASE
    let restricted_role = restrictedroomuser.role; // await getUserRole(payload.restricted.username, payload.roomid);
    let restrictor_role = roomuser.role; //  await getUserRole(payload.restrictor.username, payload.roomid);

    // TODO: if restrictor is a normal member
    // TODO: restricted === 'owner' 
    // TODO: restricted === 'admin' && restrictor === 'admin'
    if (restrictor_role === Role.MEMBER || restricted_role === Role.OWNER
      || (restricted_role === Role.ADMIN && restrictor_role === Role.ADMIN)) {
      // notif.setStatus(NOTIF_STATUS.FAILED);
      // notif.setStatusContent('Permission Denied');
      // sentpayload.notification = notif.getNotification();
      // client.emit('restriction_update', sentpayload);
      return;
    }

    let msg = payload.username + ' has been '
    // TODO: check the type of the restriction
    if (payload.restriction === RESTRICTION.BAN) {
      const update = await this.prismaService.roomUser.update({
        where: {
          Room_id_user_id: {
            Room_id: payload.roomid,
            user_id: restricteduser.id
          }
        },
        data: {
          is_banned: true,
        }
      })
      msg += 'BANNED'
    }
    else if (payload.restriction === RESTRICTION.MUTE) {
      let newDate = new Date(Date.now() + payload.duration);
     
      const update = await this.prismaService.roomUser.update({
        where: {
          Room_id_user_id: {
            Room_id: payload.roomid,
            user_id: restricteduser.id,
          }
        },
        data: {
          mute_time: newDate
        }
      })
      msg += 'MUTED'
    }
    else if (payload.restriction === RESTRICTION.KICK) {
      const update = await this.prismaService.roomUser.delete({
        where: {
          Room_id_user_id: {
            Room_id: payload.roomid,
            user_id: restricteduser.id
          }
        },
      })
      msg += 'KICKED'
    }
    // let newmesg = { sender: 'Server', messagecontent: msg, profile: 'ServerAvatar.png' };
    // this.server.to(payload.roomid.toString()).emit('messagerecieve', newmesg);


    this.sendMessageToSocketRoom(payload.roomid, 'Server', msg, 'ServerAvatar.png');
    //this.server.to(payload.roomid.toString()).emit('requestroomsupdate');

    if (payload.restriction == RESTRICTION.KICK || payload.restriction == RESTRICTION.BAN) {
      let index = this.userSocketMap.findIndex(e => e.getusername() == restricteduser.username);
      this.userSocketMap[index]?.getsocket().leave(roomuser.Room_id.toString());
      this.userSocketMap[index]?.getsocket().emit('chatclear');
      this.userSocketMap[index]?.getsocket().emit('requestroomsupdate');
    }
    return;


    // TODO: notify client in failure
    // if (sentpayload.payload == null) {
    //   notif.setStatusContent('Try Again Later');
    //   notif.setStatus(NOTIF_STATUS.FAILED);
    //   sentpayload.notification = notif.getNotification();
    //   client.emit('restriction_updated', sentpayload);
    // }
    // else {
    // TODO: send user name has been banned message in the room
    // notif.setStatus(NOTIF_STATUS.UPDATE);
    // let roomid = this.getuserSocketRoom(payload.restrictor.username);
    // sentpayload.notification = notif.getNotification();
    // this.server.to[roomid].emit('restriction_updated', sentpayload);

    // // TODO: clear payload
    // sentpayload.payload = null;

    // TODO: notify the restrictor
    // notif.setStatusContent('You Have Banned ' + payload.updateduser + 'Successfully');
    // notif.setStatus(NOTIF_STATUS.SUCCESS);
    // sentpayload.notification = notif.getNotification();
    // client.emit('restriction_updated', sentpayload);

    // // TODO: notify the restricted
    // var restrictedSocket = this.getUserSocket(payload.updateduser); // getUserSocket(payload.restricted.username);
    // notif.setStatusContent('You Have Been Banned');
    // notif.setStatus(NOTIF_STATUS.RESTRICTED);
    // sentpayload.notification = notif.getNotification();
    // restrictedSocket.emit('restriction_updated', sentpayload);
    // }

  }


  @SubscribeMessage('updaterooms')
  async updateAllSocketRooms(client: Socket) {

    try {
      const user = await this.getUserFromSocket(client);

      let notif: notification = new notification();
      var sentpayload = {
        notification: {},
        payload: null,
      };


      const roomusers = await this.getAllRoomUsersByUserId(user.id);





      let bannedroomusers = roomusers.filter((roomuser) => { roomuser.is_banned });
      let bannedrooms = bannedroomusers.map((room) => { return room.chat });



      let joinedrooms = roomusers.map((room) => {
        room.chat['joined'] = true;
        room.chat['lastmessage'] = '';
        if (room.is_banned)
          room.chat['banned'] = true;
        else
          room.chat['banned'] = false;
        //if (!room.is_banned || room.chat.type != ACCESS.DM)
        return (room.chat);
      })

      joinedrooms = joinedrooms.filter((room) => { return (room.type != ACCESS.DM) })

      //joinedrooms = joinedrooms.filter((room) => {room['banned'] == false})

      let allrooms = await this.getAllRooms(client);

      for (let i = 0; i < allrooms.length; i++) {
        let found = false;
        for (let j = 0; j < joinedrooms.length; j++) {
          if (allrooms[i].id == joinedrooms[j].id) {
            found = true
            break;
          }
        }
        if (!found)
          joinedrooms.push(allrooms[i]);
      }

     

      let rooms = await this.getAllDMs(client);

      joinedrooms.forEach((room) => rooms.push(room))

      sentpayload.payload = {
        rooms: rooms,
        otherrooms: [],
        dms: [],
      };
      client.emit('roomsupdate', sentpayload)
    }

    catch {
      // console.log('couldnt connect')
    }

  }

  async getUserFromSocket(socket: Socket) {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const token = cookies.split(';').find((c) => c.trim().startsWith('access_token='));
      if (token) {
        const payload: any = this.jwtService.decode(token.split('=')[1]);
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id },

        });
        return user;
      }
    }
    return null;
  }

  getuserSocketRoom(username: string): string {
    let index = this.userSocketMap.findIndex(usersocket => usersocket.getusername() == username);
    return this.userSocketMap[index].getroom();
  }

  getUserSocket(username: string): Socket {
    let index = this.userSocketMap.findIndex(usersocket => usersocket.getusername() == username);
    return this.userSocketMap[index].getsocket();
  }


  async getAllDMs(client: Socket) {
    const user = await this.getUserFromSocket(client);

    const dms = await this.prismaService.roomUser.findMany({
      where: {
        AND: [
          { user_id: user.id },
          {
            chat: {
              type: ACCESS.DM
            }
          }
        ]
      },
      include: { chat: true, }
    })




    let filterd = [];
    dms.forEach((room) => {
      filterd.push(room.chat)
    })


    for (let i =0; i < filterd.length; i++  )
    {
      const names = filterd[i].name.split(' - ');
      const otherusername = user.username == names[0] ? names[1] : names[0];
      filterd[i].name = otherusername;
      filterd[i]['joined'] = true;
      filterd[i]['lastmessage'] = '';
      
      
      const otheruser = await this.getUserByUserName(otherusername);
      filterd[i]['profile'] = otheruser.avatar;
    }


    return filterd
  }
  async getAllRooms(socket: Socket) {
    const allrooms = await this.prismaService.room.findMany({
      where: {
        OR: [
          { type: ACCESS.PROTECTED },
          { type: ACCESS.PUBLIC }
        ]
      },
    })
    return (allrooms);
  }

  async getAllRoomUsersByUserId(user_id: string) {
    // const roomusers = await this.prismaService.roomUser.findMany({
    //   where: {
    //     user_id: user_id
    //   },
    //   include: {
    //     chat: true
    //   }
    // })
    // return (roomusers);

    const roomusers = await this.prismaService.roomUser.findMany({
      where: {
        AND: [
          { user_id: user_id },
          { is_banned: false },
        ],
      },
      include: {
        chat: {

        }
      }
    })

    // roomusers[0].chat
    return (roomusers);
  }



  async getAllMessagesByRoomId(room_id: any, user_id: string) {
    const allMessages = await this.prismaService.messageUser.findMany({
      where: {
        room_id: room_id
      },
    })

    let messages = allMessages.map((msg) => {
      // const sender = await this.prismaService.user.findUnique({
      //   where: {
      //     id: msg.user_id
      //   }
      // })
      return {
        id: msg.Message_id,
        sender: msg.username,
        messagecontent: msg.content,
        time: msg.time,
        profile: msg.avatar
      }

      // msg['id'] = msg.Message_id,
      // msg['sender'] = sender.username,
      // msg['messagecontent'] = msg.content,
      // msg['time'] = msg.time,
      // msg['profile'] = sender.avatar

    })

    return messages
  }


  async getLastMessagesByRoomId(room_id: any) {
    const lastmessage = await this.prismaService.messageUser.findMany({
      where: {
        room_id: room_id,

      },
      orderBy: {
        time: 'desc'
      },
      take: 1
    })

    return (lastmessage);

  }

  async getUserByUserName(username: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: username
      }
    })
    return user
  }


  async getRoomUser(roomid: number, userid: string) {
    const roomuser = await this.prismaService.roomUser.findFirst({
      where: {
        AND: [{
          Room_id: roomid
        }, {
          user_id: userid
        }]
      },
      include: {
        chat: true
      }
    })
    return roomuser;
  }


  async getRoomByRoomId(room_id: number) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id: room_id
      }
    })
    return room;
  }


  sendMessageToSocketRoom(roomid: number, sender: string, msg: string, profile: string) {
    let newmesg = { sender: sender, messagecontent: msg, profile: profile };
    this.server.to(roomid.toString()).emit('messagerecieve', newmesg);
  }


  async getBlockedUsers(userid: string)
  {
    const blocked = await this.prismaService.user.findUnique({
      where:{
        id: userid
      },
      select:{
        blocked: true,
        blockedRelation: true,
      }
    })


    let blockedusernames = [];
    for (let i = 0; i < blocked.blocked.length; i++) {
      blockedusernames.push(blocked.blocked[i].username);
    }

    for (let i = 0; i < blocked.blockedRelation.length; i++) {
      blockedusernames.push(blocked.blockedRelation[i].username);
    }

    return (blockedusernames);
  }
}
