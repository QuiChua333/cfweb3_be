import { ChatService } from '@/api/chat/chat.service';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(4001, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  private activeUsers = new Map<string, string>(); // userId => socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('activeUsers', Array.from(this.activeUsers.keys()));
  }

  handleDisconnect(client: Socket) {
    const userId = Array.from(this.activeUsers.entries()).find(
      ([, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
      client.broadcast.emit('activeUsers', Array.from(this.activeUsers.keys()));
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  async handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.activeUsers.set(userId, client.id);
    console.log(`User ${userId} registered with socket ID ${client.id}`);
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const messages = await this.chatService.getMessages(userId);
      client.emit('messagesList', messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      client.emit('error', 'Failed to fetch messages');
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { senderId: string; receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { senderId, receiverId, message } = data;
      await this.chatService.saveMessage(senderId, receiverId, message);

      const receiverSocketId = this.activeUsers.get(receiverId);
      if (receiverSocketId) {
        client.to(receiverSocketId).emit('newMessage', { senderId, message });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('error', 'Failed to send message');
    }
  }
}
