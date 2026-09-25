import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConversationResponse,
  MessageResponse,
  UnreadCountResponse,
  PaginationMeta,
} from '@2becollab/types';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getUserConversations(userId: string): Promise<ConversationResponse[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        participant1: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
            creatorProfile: { select: { headline: true } },
            businessProfile: { select: { companyName: true } },
          },
        },
        participant2: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
            creatorProfile: { select: { headline: true } },
            businessProfile: { select: { companyName: true } },
          },
        },
        campaign: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const results: ConversationResponse[] = [];

    for (const conv of conversations) {
      const isP1 = conv.participant1Id === userId;
      const otherUser = isP1 ? conv.participant2 : conv.participant1;

      const unreadCount = await this.prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          isRead: false,
        },
      });

      results.push({
        id: conv.id,
        participant1Id: conv.participant1Id,
        participant2Id: conv.participant2Id,
        campaignId: conv.campaignId,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        lastMessageText: conv.lastMessageText,
        createdAt: conv.createdAt.toISOString(),
        updatedAt: conv.updatedAt.toISOString(),
        otherParticipant: {
          id: otherUser.id,
          fullName: otherUser.fullName,
          avatarUrl: otherUser.avatarUrl,
          role: otherUser.role as any,
          headline: otherUser.creatorProfile?.headline || null,
          companyName: otherUser.businessProfile?.companyName || null,
        },
        unreadCount,
        campaign: conv.campaign
          ? {
              id: conv.campaign.id,
              title: conv.campaign.title,
              status: conv.campaign.status as any,
            }
          : null,
      });
    }

    return results;
  }

  async findOrCreateConversation(
    userId: string,
    recipientId: string,
    campaignId?: string,
    initialMessage?: string,
  ): Promise<ConversationResponse> {
    if (userId === recipientId) {
      throw new BadRequestException('Cannot start conversation with yourself');
    }

    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        creatorProfile: { select: { headline: true } },
        businessProfile: { select: { companyName: true } },
      },
    });

    if (!recipient) {
      throw new NotFoundException('Recipient user not found');
    }

    // Check existing conversation
    let conv = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: recipientId, campaignId: campaignId || null },
          { participant1Id: recipientId, participant2Id: userId, campaignId: campaignId || null },
        ],
      },
      include: {
        campaign: { select: { id: true, title: true, status: true } },
      },
    });

    if (!conv) {
      // Order IDs consistently to avoid duplicate inversion
      const [p1, p2] = [userId, recipientId].sort();
      conv = await this.prisma.conversation.create({
        data: {
          participant1Id: p1!,
          participant2Id: p2!,
          campaignId: campaignId || null,
          lastMessageAt: new Date(),
          lastMessageText: initialMessage || null,
        },
        include: {
          campaign: { select: { id: true, title: true, status: true } },
        },
      });

      if (initialMessage && initialMessage.trim().length > 0) {
        await this.prisma.message.create({
          data: {
            conversationId: conv.id,
            senderId: userId,
            content: initialMessage.trim(),
          },
        });
      }
    } else if (initialMessage && initialMessage.trim().length > 0) {
      await this.createMessage(conv.id, userId, initialMessage.trim());
    }

    return {
      id: conv.id,
      participant1Id: conv.participant1Id,
      participant2Id: conv.participant2Id,
      campaignId: conv.campaignId,
      lastMessageAt: conv.lastMessageAt.toISOString(),
      lastMessageText: conv.lastMessageText,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      otherParticipant: {
        id: recipient.id,
        fullName: recipient.fullName,
        avatarUrl: recipient.avatarUrl,
        role: recipient.role as any,
        headline: recipient.creatorProfile?.headline || null,
        companyName: recipient.businessProfile?.companyName || null,
      },
      unreadCount: 0,
      campaign: conv.campaign
        ? {
            id: conv.campaign.id,
            title: conv.campaign.title,
            status: conv.campaign.status as any,
          }
        : null,
    };
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ items: MessageResponse[]; pagination: PaginationMeta }> {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const total = await this.prisma.message.count({
      where: { conversationId },
    });

    const skip = (page - 1) * limit;

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: messages.map((m: any) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        content: m.content,
        attachments: m.attachments,
        isRead: m.isRead,
        readAt: m.readAt ? m.readAt.toISOString() : null,
        createdAt: m.createdAt.toISOString(),
        sender: m.sender as any,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async createMessage(
    conversationId: string,
    senderId: string,
    content: string,
    attachments?: any,
  ): Promise<MessageResponse> {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (conv.participant1Id !== senderId && conv.participant2Id !== senderId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          content,
          attachments: attachments || undefined,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
          lastMessageText: content.slice(0, 100),
        },
      }),
    ]);

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      attachments: message.attachments,
      isRead: message.isRead,
      readAt: null,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender as any,
    };
  }

  async markAsRead(conversationId: string, userId: string): Promise<{ success: boolean }> {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  async getUnreadCount(userId: string): Promise<UnreadCountResponse> {
    const userConversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      select: { id: true },
    });

    const convIds = userConversations.map((c: any) => c.id);

    if (convIds.length === 0) {
      return { unreadCount: 0 };
    }

    const unreadCount = await this.prisma.message.count({
      where: {
        conversationId: { in: convIds },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return { unreadCount };
  }
}
