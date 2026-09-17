import { apiClient } from '@/lib/api/client';
import {
  ConversationResponse,
  MessageResponse,
  SendMessagePayload,
  StartConversationPayload,
  UnreadCountResponse,
  PaginationMeta,
} from '@2becollab/types';

export const messagesApi = {
  getConversations: async (): Promise<ConversationResponse[]> => {
    const res = await apiClient.get('/conversations');
    return res.data.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const res = await apiClient.get('/conversations/unread-count');
    return res.data.data;
  },

  startConversation: async (
    payload: StartConversationPayload,
  ): Promise<ConversationResponse> => {
    const res = await apiClient.post('/conversations', payload);
    return res.data.data;
  },

  getMessages: async (
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<{ items: MessageResponse[]; pagination: PaginationMeta }> => {
    const res = await apiClient.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return res.data.data;
  },

  sendMessage: async (
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<MessageResponse> => {
    const res = await apiClient.post(`/conversations/${conversationId}/messages`, payload);
    return res.data.data;
  },

  markAsRead: async (conversationId: string): Promise<{ success: boolean }> => {
    const res = await apiClient.patch(`/conversations/${conversationId}/read`);
    return res.data.data;
  },
};
