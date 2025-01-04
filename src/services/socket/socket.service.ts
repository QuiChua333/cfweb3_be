import { Injectable } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  broadcastToClients(event: string, data: any) {
    this.socketGateway.server.emit(event, data); // Gửi tới tất cả client
  }
}
