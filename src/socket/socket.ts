import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { IJoinRoom, IMessage, TRoom } from '../interfaces';

const prisma = new PrismaClient();

export const setUpSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  console.log('socket server created');

  const rooms: TRoom = new Map();

  const joinRoom = async (socket: Socket, joinRoomInfo: IJoinRoom) => {
    const room = await checkUserCanJoin(
      joinRoomInfo.roomId,
      joinRoomInfo.roomType,
      socket.userId as string,
    );
    if (!room) {
      return;
    }
    if (rooms.has(joinRoomInfo.roomId)) {
      rooms
        .get(joinRoomInfo.roomId)
        ?.users.set(socket.userId as string, socket.id);
      socket.join(joinRoomInfo.roomId);
      console.log(`user ${socket.id} joined room ${joinRoomInfo.roomId}`);
    } else {
      rooms.set(joinRoomInfo.roomId, {
        roomId: joinRoomInfo.roomId,
        users: new Map().set(socket.userId as string, socket.id),
      });
      socket.join(joinRoomInfo.roomId);
      console.log(
        `Room ${joinRoomInfo.roomId} created and user ${socket.id} joined`,
      );
    }
  };

  const leaveRoom = (userId: string, roomId: string) => {
    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(userId as string);
      if (room.users.size === 0) {
        rooms.delete(roomId);
        console.log(`empty room ${roomId} deleted`);
      }
    }
  };

  const checkUserCanJoin = async (
    roomId: string,
    roomType: string,
    userId: string,
  ) => {
    var room;
    if (roomType === 'CONVERSATION') {
      room = await prisma.conversation.findUnique({
        where: {
          id: roomId,
          OR: [
            {
              participant1Id: userId,
            },
            {
              participant2Id: userId,
            },
          ],
        },
      });
    } else {
      room = await prisma.group.findUnique({
        where: {
          id: roomId,
          OR: [
            {
              adminId: userId,
            },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
      });
    }
    if (!room) {
      console.log('unauthorized to join room');
    } else {
      return room;
    }
  };

  const sendMessage = async (userId: string, sendMessage: IMessage) => {
    var message;
    const roomId =
      sendMessage.targetType === 'CONVERSATION'
        ? (sendMessage.conversationId as string)
        : (sendMessage.groupId as string);
    const roomExists = rooms.get(roomId);
    if (!roomExists || !roomExists?.users.has(userId as string)) {
      console.log('not in the room');
      return;
    }
    message = await prisma.message.create({
      data: {
        content: sendMessage.content as string,
        uploadURL: sendMessage.uploadUrl,
        uploadPublicId: sendMessage.uploadPublicId,
        replyId: sendMessage.replyId,
        senderId: userId,
        type: sendMessage.type,
        targetType: sendMessage.targetType,
        conversationId: sendMessage.conversationId,
        groupId: sendMessage.groupId,
      },
      include: {
        conversation: true,
        group: true,
        sender: true,
        replies: true,
      },
    });
    io.to(rooms.get(roomId)?.roomId as string).emit('recieve_message', {
      message,
    });
  };

  io.use((socket, next) => {
    // TODO: user authetication
  });

  io.on('connection', (socket) => {
    const userId = socket.userId as string;

    socket.on('join_room', async (joinRoomInfo: IJoinRoom) => {
      await joinRoom(socket, joinRoomInfo);
    });

    socket.on('leave_room', (roomId: string) => {
      leaveRoom(userId, roomId);
    });

    socket.on('remove_from_room', async (userIds: string[], roomId: string) => {
      const admin = await prisma.group.findUnique({
        where: {
          id: roomId,
          adminId: userId,
        },
      });
      if (!admin) {
        console.log('unauthorized to remove members');
      } else {
        userIds.map((userId) => {
          leaveRoom(userId, roomId);
        });
      }
    });

    socket.on('send_message', async (message: IMessage) => {
      await sendMessage(userId, message);
    });

    socket.on('disconnect', () => {
      rooms.forEach((_, roomId) => {
        leaveRoom(userId, roomId);
      });
      socket.disconnect();
    });
  });
};
