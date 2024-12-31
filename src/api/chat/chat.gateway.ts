import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Cho phép tất cả các domain kết nối
    },
  })
  export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    private activeUsers = new Map<string, string>(); // Map lưu userId và socketId
  
    afterInit(server: Server) {
      console.log('WebSocket Gateway initialized');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.activeUsers.delete(client.id); // Xóa user khỏi danh sách active
    }
  
    @SubscribeMessage('join')
    handleJoin(client: Socket, payload: { userId: string }) {
      this.activeUsers.set(client.id, payload.userId);
      console.log(`User ${payload.userId} joined with socket ${client.id}`);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: { to: string; message: string }) {
      const receiverSocket = Array.from(this.activeUsers.entries()).find(
        ([, userId]) => userId === payload.to,
      )?.[0];
  
      if (receiverSocket) {
        this.server.to(receiverSocket).emit('message', {
          from: this.activeUsers.get(client.id),
          message: payload.message,
        });
      } else {
        console.log('User not online');
      }
    }
  }
  