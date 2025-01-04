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

  handleConnection(client: Socket) {
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

    const senderClientId = this.activeUsers.find((item) => item.userId === senderId).clientId;
    const receiverClientId = this.activeUsers.find((item) => item.userId === receiverId);
    if (receiverClientId) {
      this.server.to(receiverClientId.clientId).emit('newMessage', newMessage);
    }
    this.server.to(senderClientId).emit('newMessage', newMessage);
  }
}
