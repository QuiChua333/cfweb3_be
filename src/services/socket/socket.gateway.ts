import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IActiveUser } from './socket.interface';
import { ChatService } from '@/api/chat/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  private activeUsers: IActiveUser[] = [];
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    const userId = (client.handshake.query.userId || '') as string;
    const newActiveUser: IActiveUser = {
      userId,
      clientId: client.id,
    };

    this.activeUsers.push(newActiveUser);

    console.log(this.activeUsers);
    this.server.emit(
      'activeUsers',
      this.activeUsers.map((item) => item.userId),
    );

    const totalUnreadMessage = await this.countUnreadMessage(newActiveUser.userId);
    client.emit('totalUnreadMessage', totalUnreadMessage);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers = this.activeUsers.filter((item) => item.clientId !== client.id);
    this.server.emit(
      'activeUsers',
      this.activeUsers.map((item) => item.userId),
    );
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() data: { chatRoomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessages(data.chatRoomId);
    client.emit('messages', messages);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: { chatRoomId: string; senderId: string; receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, senderId, receiverId, message } = data;
    const newMessage = await this.chatService.saveMessage(
      chatRoomId,
      senderId,
      receiverId,
      message,
    );

    const receiverClientIds = this.activeUsers
      .filter((item) => item.userId === receiverId)
      .map((item) => item.clientId);
    const totalUnreadMessage = await this.countUnreadMessage(receiverId);
    if (receiverClientIds?.length > 0) {
      this.server.to(receiverClientIds).emit('newMessage', newMessage);
      this.server.to(receiverClientIds).emit('totalUnreadMessage', totalUnreadMessage);
    }
    client.emit('newMessage', newMessage);
  }

  @SubscribeMessage('seenMessage')
  async seenMessage(
    @MessageBody()
    data: { chatRoomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = data;

    const userId = this.activeUsers.find((item) => item.clientId === client.id).userId;
    await this.chatService.seenMessage(chatRoomId, userId);
  }

  async countUnreadMessage(userId: string) {
    const totalUnreadMessage = await this.chatService.countUnreadMessage(userId);
    return totalUnreadMessage;
  }

  emitEvent(event: string, data: any, userIds?: string[]) {
    console.log(data);
    if (userIds && userIds.length > 0) {
      const clientIds = this.activeUsers
        .filter((user) => userIds.includes(user.userId))
        .map((user) => user.clientId);

      this.server.to(clientIds).emit(event, data);
    }
  }
}
