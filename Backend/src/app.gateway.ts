import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit, Req } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from "socket.io"
import { JwtGuard } from 'src/auth/guard';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto';
import { ModeGame, User, UserStatus } from '@prisma/client';
import { Console } from 'console';


// interface UserStatus {
//     ON: 'ON',
//     OFF: 'OFF',
//     INGAME: 'INGAME',
//     INQUEUE: 'INQUEUE'
//   };

interface Achievement {
  GREAT_WIRATE: 'GREAT_WIRATE',
  LEGEND_WIRATE: 'LEGEND_WIRATE',
  DECENT_WIRATE: 'DECENT_WIRATE',
  GREAT_LOSER: 'GREAT_LOSER',
  FIVE_WIN_STREAK: 'FIVE_WIN_STREAK',
  TEN_WIN_STREAK: 'TEN_WIN_STREAK',
  GREAT_AVATAR: 'GREAT_AVATAR',
  COMMUNICATOR: 'COMMUNICATOR'
};

interface user_info_whistory {

  user1_name: string;
  user2_name: string;

  user1_score: number;
  user2_score: number;

  user1_avatar: string;
  user2_avatar: string;
  //achievements: Achievement[]
}


class user_info_whistory {
  constructor() {
    this.user1_name = "";
    this.user2_name = "";

    this.user1_score = 0;
    this.user2_score = 0;

    this.user1_avatar = "";
    this.user2_avatar = "";
    //this.achievements = [];
  }
  User_get_all() {
    return {

      user1_name: this.user1_name,
      user2_name: this.user2_name,

      user1_score: this.user1_score,
      user2_score: this.user2_score,

      user1_avatar: this.user1_avatar,
      user2_avatar: this.user2_avatar,
      //achievements : this.achievements,
    }
  }

}

interface user_info {
  id: string
  full_name: string
  username: string
  avatar: string
  avatar_key: string | null
  is_two_fa_enable: boolean
  two_fa_code: string | null
  email: string
  //status: UserStatus
  win: number
  lose: number
  score: number
  win_streak: number
  //achievements: Achievement[]
}


class user_info {
  constructor() {
    this.id = "";
    this.full_name = "";
    this.username = "";
    this.avatar = "";
    this.avatar_key = "";
    this.is_two_fa_enable = false;
    this.two_fa_code = "";
    this.email = "";
    //this.status = this.status;
    this.win = 0;
    this.lose = 0;
    this.score = 0;
    this.win_streak = 0;
    //this.achievements = [];
  }
  User_get_all() {
    return {
      id: this.id,
      full_name: this.full_name,
      username: this.username,
      avatar: this.avatar,
      avatar_key: this.avatar_key,
      is_two_fa_enable: this.is_two_fa_enable,
      two_fa_code: this.two_fa_code,
      email: this.email,
      //status : this.status,
      win: this.win,
      lose: this.lose,
      score: this.score,
      win_streak: this.win_streak,
      //achievements : this.achievements,
    }
  }
  user_set_all(new_user: User) {
    this.id = new_user.id;
    this.full_name = new_user.full_name;
    this.username = new_user.username;
    this.avatar = new_user.avatar;
    this.avatar_key = new_user.avatar_key;
    this.is_two_fa_enable = new_user.is_two_fa_enable;
    this.two_fa_code = new_user.two_fa_code;
    this.email = new_user.email;
    //this.status = new_user.status;
    this.win = new_user.win;
    this.lose = new_user.lose;
    this.score = new_user.score;
    this.win_streak = new_user.win_streak;
    //this.achievements = new_user.achievements;
  }
}

interface props {
  server: Server;
  socket_ids: Array<string>;
  user_id: string;
  username: string;
  user_status: string;
  room: string;
}

interface propsinho {
  socket_ids: Array<string>;
  user_id: string;
  username: string;
  user_status: string;
}

class props {
  constructor(server: Server) {
    this.server = server;
    this.socket_ids = [];
    this.user_id = "";
    this.username = "";
    this.user_status = "";
    this.room = "";


  }
  props_status(): propsinho {
    return {
      socket_ids: this.socket_ids,
      user_id: this.user_id,
      username: this.username,
      user_status: this.user_status,
    }
  }
  emitting_events(): void {
    //console.log(this.props_status().user_status)
    this.server.to(this.room).emit("game_invite", this.props_status());
  }

}




@WebSocketGateway(3080, {
  cors: {
    credentials: true,
    origin: 'http://10.12.3.2:3000',
  }
})



export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwtService: JwtService, private readonly prismaService: PrismaService) { }
  private logger: Logger = new Logger("AppGateway");
  private my_users: Array<props> = Array<props>();

  private server: Server;
  private my_unique_users: Array<user_info> = Array<user_info>();;

  async afterInit(server: Server) {
    this.server = server;
    // console.log("Habibi weeeecchhh");

    let all_users = await this.prismaService.user.findMany({
    });

    for (let i = 0; i < all_users.length; i++) {

      await this.prismaService.user.update({
        where: { id: all_users[i].id },
        data: {
          status: "OFF",
        }
      })
    }
  }

  async handleConnection(client: Socket, payload: any) {
    const user = await this.getUserFromSocket(client);
    // console.log("Heeeere yawdi awdi");

    if (user) {
      if (user.status === "OFF") {
        await this.prismaService.user.update({
          where: { id: user.id },
          data: {
            status: "ON",
          }
        })
        user.status = "ON";
      }
      if (this.my_users.length === 0) {
        this.my_users.push(new props(this.server));
        this.my_users[0].socket_ids.push(client.id);

        this.my_users[0].user_id = user.id;
        this.my_users[0].username = user.username;
        this.my_users[0].user_status = user.status;
        this.my_users[0].room = user.id;
        // console.log("M3lem wslti hna a "+user.username+" Mol had socket " +this.my_users[0].socket_ids[0]+this.my_users[0].user_status);
        this.my_unique_users.push(new user_info());
        this.my_unique_users[0].user_set_all(user);

        client.join(this.my_users[0].room);
        //this.my_users[0].emitting_events();
      }
      else {
        let i;
        for (i = 0; i < this.my_users.length; i++) {
          if (user.username === this.my_users[i].username)
            break;
        }
        if (i === this.my_users.length) {
          this.my_users.push(new props(this.server));
          this.my_users[i].room = user.id;
          this.my_users[i].user_id = user.id;
          this.my_users[i].username = user.username;
          this.my_users[i].user_status = user.status;

          this.my_unique_users.push(new user_info());
          this.my_unique_users[this.my_unique_users.length - 1].user_set_all(user);

        }
        this.my_users[i].socket_ids.push(client.id);
        //console.log("M3lem wslti hna a "+user.username+" Mol had socket " +this.my_users[i].socket_ids[0]+this.my_users[i].user_status);                
        client.join(this.my_users[i].room);
        //this.my_users[0].emitting_events();
      }
    }

  }

  @SubscribeMessage("invite_game")
  async inviting_game(socket: Socket, payload: any) {
    const user = await this.getUserFromSocket(socket);
    if (user) {
      // console.log("i am " + user.username + "i'm trying to invite the player " + payload.player1.username);
      let i;
      let j = 0;
      let x = 0;
      for (i = 0; i < this.my_users.length; i++) {
        if (this.my_users[i].username === payload.player1.username) {
          x = i;
        }
        else if (this.my_users[i].username === user.username) {
          j = i;
        }
      }
      if (x !== this.my_users.length) {
        const akhir_user = this.my_unique_users[j].User_get_all();

        // console.log("Ana hwa " + akhir_user.username);
        const new_usr = await this.prismaService.user.update({
          where: { id: akhir_user.id },
          data: {
            status: "INQUEUE",
          }
        });
        // console.log("zabi hana " + new_usr.status + " " + this.my_users[x].user_status);

        if (this.my_users[x].user_status === UserStatus.ON) {
          // console.log("qalwa");
          this.server.to(this.my_users[x].room).emit("game_invite", this.my_unique_users[j].User_get_all());
        }
        else {
        }

      }
    }

  }

  async handleDisconnect(player_ref: Socket) {

  }

  async get_this_user(user_id: string) {
    const new_user = await this.prismaService.user.findUnique({
      where: { id: user_id },
    });

    if (new_user)
      return new_user;
  }


  @SubscribeMessage('get_match_history')
  async match_history_all(socket: Socket, payload: any) {
    //console.log("Heeehoo");
    const user_nb = await this.prismaService.user.count({
      where: {
        username: payload.username,
      },
    });
    if (user_nb) {
      const user = await this.prismaService.user.findFirst({
        where: {
          username: payload.username,
        }
      });

      const games = await this.prismaService.game.findMany({
        where: {
          OR: [
            { user1: { id: user.id } },
            { user2: { id: user.id } }
          ]
        },
        take: 5,
      });

      let my_user_hiss: Array<user_info_whistory> = Array<user_info_whistory>();;

      for (let i = 0; i < games.length; i++) {
        my_user_hiss.push(new user_info_whistory());

        const new_user1 = await this.get_this_user(games[i].user1_id);
        const new_user2 = await this.get_this_user(games[i].user2_id);

        if (new_user1 && new_user2) {
          my_user_hiss[i].user1_name = new_user1.username;
          my_user_hiss[i].user2_name = new_user2.username;

          my_user_hiss[i].user1_avatar = new_user1.avatar;
          my_user_hiss[i].user2_avatar = new_user2.avatar;

          my_user_hiss[i].user1_score = games[i].user1_score;
          my_user_hiss[i].user2_score = games[i].user2_score;
        }
        //console.log("scores are "+my_user_hiss[i].user1_score + " "+my_user_hiss[i].user2_score);
      }
      // console.log("Match number is "+my_user_hiss.length);
      this.server.emit("match_history", my_user_hiss);

    }



  }






  async getUserFromSocket(socket: Socket) {
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
      const token = cookies.split(';').find((c) => c.trim().startsWith('access_token='));
      if (token) {
        const payload: any = this.jwtService.decode(token.split('=')[1]);
        //console.table(payload);
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id },

        });
        //console.log(user);
        return user;
      }
    }
    return null;
  }

}