import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Achievement, Role, UserStatus, ACCESS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';
import { AccessAnalyzer, S3 } from 'aws-sdk';
import crypto = require('crypto');
import { log } from 'console';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}
  async change_full_name(user, new_full_name: string, @Res() res) {
    try {
      // console.log(new_full_name);

      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          full_name: new_full_name,
        },
      });
      res.json({ message: 'success!' });
    } catch {
      throw new HttpException(
        'Error while updating username',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async get_user_all(user_obj: UserDto, @Res() res) {
    // console.log(user);
    try{
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_obj.id,
        },
      });
      res.json(user);
    }
    catch{
      throw new HttpException(
        'Error while getting users',
        HttpStatus.BAD_REQUEST,);
    }
  }

  async get_me(user_obj: UserDto, @Res() res) {
    const user = await this.get_user(user_obj.id);
    res.json(user);
  }

  async get_which_friend(user_obj, which_friend: string, @Res() res) {
    const user_nb = await this.prisma.user.count({
      where: {
        username: which_friend,
      },
    });
    if (user_nb == 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      const user_friend = await this.prisma.user.findFirst({
        where: {
          username: which_friend,
        },
      });
      res.json(user_friend);
    }
    // if (){
    //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // }
    // else{
    // }
  }
  async get_user_score(user_obj: UserDto, @Res() res) {
    try {
      const user = await this.get_user(user_obj.id);
      const win: number = user.win;
      const lose: number = user.lose;
      let score: number = 0;
      const winrate = (win / (win + lose)) * 100;
      if (winrate >= 80) {
        score = win * 300 - lose * 100 + 1000;
      } else if (winrate >= 60) {
        score = win * 300 - lose * 100 + 500;
      } else if (winrate >= 50) {
        score = win * 300 - lose * 100 + 200;
      } else {
        score = win * 300 - lose * 100;
      }
      res.json((await this.update_user_score(user, score)).score);
    } catch {
      throw new HttpException(
        'Error while updating score',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async get_user(req_id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: req_id,
      },
    });
    return user;
  }
  async update_user_score(user, score: number) {
    try {
      const updated_user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          score: score,
        },
      });
      return updated_user;
    } catch {
      throw new HttpException(
        'Error while updating score',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async update_user_achievements(user, achievement: Achievement) {
    try {
      if (!user.achievements.includes(achievement)) {
        const updated_user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            achievements: {
              push: achievement,
            },
          },
        });
        return updated_user;
      }
      return user;
    } catch {
      throw new HttpException(
        'Error while updating achievements',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async edit_user_status(user: UserDto, status: UserStatus) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        status: status,
      },
    });
  }
  async get_user_achievements(user_obj: UserDto, @Res() res) {
    try {
      let user = await this.get_user(user_obj.id);
      const winrate = (user.win / (user.win + user.lose)) * 100;
      if (user.win_streak >= 10) {
        user = await this.update_user_achievements(
          user,
          Achievement.TEN_WIN_STREAK,
        );
      } else if (user.win_streak >= 5) {
        user = await this.update_user_achievements(
          user,
          Achievement.FIVE_WIN_STREAK,
        );
      }
      if (winrate >= 80) {
        user = await this.update_user_achievements(
          user,
          Achievement.LEGEND_WIRATE,
        );
      } else if (winrate >= 60) {
        user = await this.update_user_achievements(
          user,
          Achievement.GREAT_WIRATE,
        );
      } else if (winrate >= 50) {
        user = await this.update_user_achievements(
          user,
          Achievement.DECENT_WIRATE,
        );
      } else {
        user = await this.update_user_achievements(
          user,
          Achievement.GREAT_LOSER,
        );
      }
      res.json(user.achievements);
    } catch {
      throw new HttpException(
        'Error while updating achievements',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async get_leaderboard(@Res() res) {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          score: 'desc',
        },
        take: 10,
      });
      // for(let i = 0; i < users.length; i++){
      //     console.log(users[i].score, users[i].username);
      // }
      res.json(users);
    } catch {
      throw new HttpException(
        'Error while getting leaderboard',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async add_friend(user_rep, friend_name: string, @Res() res) {
    const nb_user: number = await this.prisma.user.count({
      where: {
        username: friend_name,
      },
    });
    if (nb_user == 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else if (nb_user == 1) {
      const user = await this.get_user(user_rep.id);
      const friend = await this.prisma.user.findFirst({
        where: {
          username: friend_name,
        },
      });
      const user_friends = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          friends: true,
        },
      });

      const user_blocked = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          blocked: true,
        },
      });
      const friend_blocked = await this.prisma.user.findUnique({
        where: {
          id: friend.id,
        },
        select: {
          blocked: true,
        },
      });

      for (let i = 0; i < user_blocked.blocked.length; i++) {
        if (user_blocked.blocked[i].username == friend_name) {
          throw new HttpException('User blocked', HttpStatus.BAD_REQUEST);
        }
      }

      for (let i = 0; i < friend_blocked.blocked.length; i++) {
        // console.log(friend_blocked.blocked[i].username + " | " + user.username)
        if (friend_blocked.blocked[i].username == user.username) {
          throw new HttpException(
            'You have been blocked',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      for (let i = 0; i < user_friends.friends.length; i++) {
        if (user_friends.friends[i].username == friend_name) {
          throw new HttpException(
            'Friend already added',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const updated_user = await this.prisma.user.update({
        where: { id: user.id },
        include: { friends: true },
        data: {
          friends: {
            connect: {
              id: friend.id,
            },
          },
        },
      });
      const updated_friend = await this.prisma.user.update({
        where: { id: friend.id },
        include: { friends: true },
        data: {
          friends: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      this.create_dm_room(user, friend);
      res.json({ message: 'success' });
    }
  }
  async create_dm_room(user, friend) {
    const room = await this.prisma.room.create({
      data: {
        name: user.username + ' - ' + friend.username,
        type: ACCESS.DM,
      },
    });

    const roomuser = await this.prisma.roomUser.create({
      data: {
        user_id: user.id,
        Room_id: room.id,
        role: Role.MEMBER,
        is_banned: false,
        mute_time: new Date(),
      },
    });
    const roomuser2 = await this.prisma.roomUser.create({
      data: {
        user_id: friend.id,
        Room_id: room.id,
        role: Role.MEMBER,
        is_banned: false,
        mute_time: new Date(),
      },
    });
  }
  async delete_dm_room(user_id, friend_id) {
    const rooms = await this.prisma.room.findMany({
      where: {
        type: ACCESS.DM,
        users: {
          every: { user: { id: { in: [user_id, friend_id] } } },
        },
      },
    });
    const roomIds = rooms.map((room) => room.id);
    await this.prisma.roomUser.deleteMany({
      where: { Room_id: { in: roomIds } },
    });
    await this.prisma.room.deleteMany({
      where: {
        type: ACCESS.DM,
        users: {
          every: { user: { id: { in: [user_id, friend_id] } } },
        },
      },
    });
  }
  async get_friends(user: UserDto, @Res() res) {
    try {
      const friends = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          friends: true,
        },
      });
      res.json(friends.friends);
    } catch {
      throw new HttpException(
        'Error while getting friends',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async upload(user_obj: UserDto, file) {
    try {
      const user = await this.get_user(user_obj.id);
      const { originalname } = file;
      const bucketS3 = this.config.get('AWS_BUCKET_NAME');
      return await this.uploadS3(user, file.buffer, bucketS3, originalname);
    } catch {
      throw new HttpException(
        'Error while uploading image',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async uploadS3(user, file, bucket, name) {
    const s3 = this.getS3();
    const generateFileName = (bytes = 15) =>
      crypto.randomBytes(bytes).toString('hex');
    const fileName: string = generateFileName() + name;

    //     const sharp = require('sharp');
    //     const fileBuffer = await sharp(file)
    // .resize({ height: 1920, width: 1080, fit: "contain" })
    // .toBuffer()

    var params = {
      Bucket: bucket,
      Key: fileName,
      ContentEncoding: 'base64',
      ContentDisposition: 'inline',
      ContentType: 'image/jpeg' || 'image/png' || 'image/jpg' || 'image/gif',
      Body: file,
    };

    // return new Promise((resolve, reject) => {
    //     s3.upload(params, (err, data) => {
    //         if (err) {
    //             Logger.error(err);
    //             reject(err.message);
    //         }
    //         resolve(data);
    //         this.upload_avatar(user, data.Location, bucket, s3, data.Key);
    //     });

    // });
    try {
      let data = await s3.upload(params).promise();
      await this.upload_avatar(user, data.Location, bucket, s3, data.Key);
      return data;
    } catch (err) {
      Logger.error(err);
      // throw err.message;
      throw new HttpException(
        'Error while uploading image',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  getS3() {
    return new S3({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
    });
  }
  async upload_avatar(user, avatar_link: string, bucket, s3, data_key: string) {
    const old_avatar_key = user.avatar_key;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: avatar_link,
        avatar_key: data_key,
      },
    });
    if (old_avatar_key != null) {
      var params = { Bucket: bucket, Key: old_avatar_key };
      // delete object from s3

      // s3.deleteObject(params, function(err, data) {
      // if (err) console.log(err, err.stack);  // error
      // else     console.log();                 // deleted
      // });
    }
  }
  async get_user_friends(user: UserDto, @Res() res) {
    try {
      const user_friends = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          friends: true,
        },
      });
      res.json(user_friends.friends);
    } catch {
      throw new HttpException(
        'Error while getting friends',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async remove_friend(user, friend_name: string, @Res() res) {
    const user_nb = await this.prisma.user.count({
      where: {
        username: friend_name,
      },
    });
    if (user_nb == 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      const friend = await this.prisma.user.findFirst({
        where: {
          username: friend_name,
        },
      });
      const user_friends = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          friends: true,
        },
      });
      let friend_found = false;
      for (let i = 0; i < user_friends.friends.length; i++) {
        if (user_friends.friends[i].username == friend_name) {
          friend_found = true;
          break;
        }
      }
      if (friend_found == false) {
        throw new HttpException('Friend not found', HttpStatus.BAD_REQUEST);
      }
      const updated_user = await this.prisma.user.update({
        where: { id: user.id },
        include: { friends: true },
        data: {
          friends: {
            disconnect: {
              id: friend.id,
            },
          },
        },
      });
      const updated_friend = await this.prisma.user.update({
        where: { id: friend.id },
        include: { friends: true },
        data: {
          friends: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });
      this.delete_dm_room(user.id, friend.id);
      res.json({ message: 'success' });
    }
  }
  async block_friend(user_req, friend_name: string, @Res() res) {
    const user_nb = await this.prisma.user.count({
      where: {
        username: friend_name,
      },
    });
    if (user_nb == 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      const block_friend = await this.prisma.user.findFirst({
        where: {
          username: friend_name,
        },
      });
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_req.id,
        },
        select: {
          blocked: true,
        },
      });
      let blocked_friend_found = false;
      for (let i = 0; i < user.blocked.length; i++) {
        if (user.blocked[i].username == friend_name) {
          blocked_friend_found = true;
          break;
        }
      }
      if (blocked_friend_found == true) {
        throw new HttpException(
          'Friend already blocked',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.delete_dm_room(user_req.id, block_friend.id);
      const updated_user = await this.prisma.user.update({
        where: { id: user_req.id },
        include: { blocked: true },
        data: {
          blocked: {
            connect: {
              id: block_friend.id,
            },
          },
          friends: {
            disconnect: {
              id: block_friend.id,
            },
          },
        },
      });
      const updated_friend = await this.prisma.user.update({
        where: { id: block_friend.id },
        include: { friends: true },
        data: {
          friends: {
            disconnect: {
              id: user_req.id,
            },
          },
        },
      });
      res.json({ message: 'success' });
    }
  }
  async status_friend(user_req, friend_name: string, @Res() res) {
    const user_nb = await this.prisma.user.count({
      where: {
        username: friend_name,
      },
    });
    if (user_nb == 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      let status: string = 'friend';
      const user = await this.get_user(user_req.id);
      const friend = await this.prisma.user.findFirst({
        where: {
          username: friend_name,
        },
      });
      const user_friends = await this.prisma.user.findUnique({
        where: {
          id: user_req.id,
        },
        select: {
          friends: true,
        },
      });
      const user_blocked = await this.prisma.user.findUnique({
        where: {
          id: user_req.id,
        },
        select: {
          blocked: true,
        },
      });
      const friend_blocked = await this.prisma.user.findUnique({
        where: {
          id: friend.id,
        },
        select: {
          blocked: true,
        },
      });
      let friend_found = false;
      for (let i = 0; i < user_friends.friends.length; i++) {
        if (user_friends.friends[i].username == friend_name) {
          friend_found = true;
          break;
        }
      }
      if (friend_found == false) {
        status = 'not_friend';
      }
      let blocked_friend_found = false;
      for (let i = 0; i < user_blocked.blocked.length; i++) {
        if (user_blocked.blocked[i].username == friend_name) {
          blocked_friend_found = true;
          break;
        }
      }
      for (let i = 0; i < friend_blocked.blocked.length; i++) {
        if (friend_blocked.blocked[i].username == user.username) {
          blocked_friend_found = true;
          break;
        }
      }
      if (blocked_friend_found == true) {
        status = 'blocked';
      }
      res.json({ message: 'success', status: status });
    }
  }
  async unblock_friend(user_req, friend_name: string, @Res() res) {
    const user_nb = await this.prisma.user.count({
      where: {
        username: friend_name,
      },
    });
    if (user_nb == 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      const unblock_friend = await this.prisma.user.findFirst({
        where: {
          username: friend_name,
        },
      });
      const user_blocked = await this.prisma.user.findUnique({
        where: {
          id: user_req.id,
        },
        select: {
          blocked: true,
        },
      });
      let blocked_friend_found = false;
      for (let i = 0; i < user_blocked.blocked.length; i++) {
        if (user_blocked.blocked[i].username == friend_name) {
          blocked_friend_found = true;
          break;
        }
      }
      if (blocked_friend_found == false) {
        throw new HttpException('Friend not blocked', HttpStatus.BAD_REQUEST);
      }
      const updated_user = await this.prisma.user.update({
        where: { id: user_req.id },
        include: { blocked: true },
        data: {
          blocked: {
            disconnect: {
              id: unblock_friend.id,
            },
          },
        },
      });
      res.json({ message: 'success' });
    }
  }
  async get_history(user_req, username : string, @Res() res) {
    const user_nb = await this.prisma.user.count({
      where: {
        username: username,
      },
    });
    if (user_nb == 0) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          username: username,
      }});
      const games = await this.prisma.game.findMany({
            where: {
              OR: [
                { user1: { id: user.id } },
                { user2: { id: user.id } }
              ]
            },
            orderBy: {
              time: 'desc'
            },
            take: 5
          });
      const game_infos = [];
      interface Igame {
        username1 : string,
        score1 : number,
        avatar1 : string,
        username2 : string,
        score2 : number,
        avatar2 : string,
      } 
      for(let i = 0; i < games.length; i++){
        let tmp_game : Igame= {
          username1 : '',
          score1 : 0,
          avatar1 : '',
          username2 : '',
          score2 : 0,
          avatar2 : '',
        };
        const tmp_user1 = await this.get_user(games[i].user1_id);
        const tmp_user2 = await this.get_user(games[i].user2_id);

        tmp_game.username1 = tmp_user1.username;
        tmp_game.score1 = games[i].user1_score;
        tmp_game.avatar1 = tmp_user1.avatar;
        tmp_game.username2 = tmp_user2.username;
        tmp_game.score2 = games[i].user2_score;
        tmp_game.avatar2 = tmp_user2.avatar;

        game_infos.push(tmp_game);
      }
      res.json(game_infos);
    }
  }
}

// "Action": [
//     "s3:AbortMultipartUpload",
//     "s3:PutObject",
//     "s3:GetObject",
//     "s3:DeleteObject"
// ],


// async function getUserGameHistory(userId) {
//   const games = await this.prisma.game.findMany({
//     where: {
//       OR: [
//         { user1: { id: userId } },
//         { user2: { id: userId } }
//       ]
//     }
//   });
//   return games;
// }
