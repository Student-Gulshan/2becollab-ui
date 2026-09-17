import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn(`Client connection rejected: No token found (${client.id})`);
        client.disconnect();
        return;
      }

      const secret = this.configService.get<string>('JWT_ACCESS_SECRET', 'default-dev-secret');
      const payload = this.jwtService.verify(token, { secret });

      client.data.userId = payload.sub;
      client.join(`user_${payload.sub}`);
      this.logger.log(`Client authenticated: user_${payload.sub} (${client.id})`);
    } catch (err: any) {
      this.logger.warn(`Client authentication failed: ${err.message} (${client.id})`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.logger.log(`Client disconnected: user_${client.data.userId} (${client.id})`);
    }
  }

  private extractToken(client: Socket): string | null {
    // 1. Auth payload from client
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }

    // 2. Authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // 3. Cookie header
    const cookieHeader = client.handshake.headers.cookie;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, curr) => {
        const [key, val] = curr.trim().split('=');
        if (key && val) acc[key] = decodeURIComponent(val);
        return acc;
      }, {} as Record<string, string>);
      if (cookies['access_token']) {
        return cookies['access_token'];
      }
    }

    return null;
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.join(`conv_${data.conversationId}`);
      this.logger.debug(`User ${client.data.userId} joined conv_${data.conversationId}`);
    }
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.leave(`conv_${data.conversationId}`);
      this.logger.debug(`User ${client.data.userId} left conv_${data.conversationId}`);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      conversationId: string;
      content: string;
      attachments?: any;
    },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    try {
      const message = await this.messagesService.createMessage(
        data.conversationId,
        userId,
        data.content,
        data.attachments,
      );

      // Broadcast to room
      this.server.to(`conv_${data.conversationId}`).emit('new_message', message);

      return { success: true, data: message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId || !data?.conversationId) return;

    client.to(`conv_${data.conversationId}`).emit('user_typing', {
      userId,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId || !data?.conversationId) return;

    client.to(`conv_${data.conversationId}`).emit('user_stop_typing', {
      userId,
      conversationId: data.conversationId,
    });
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (!userId || !data?.conversationId) return;

    try {
      await this.messagesService.markAsRead(data.conversationId, userId);
      client.to(`conv_${data.conversationId}`).emit('messages_read', {
        conversationId: data.conversationId,
        readerId: userId,
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}
