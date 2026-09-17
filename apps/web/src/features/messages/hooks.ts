import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { messagesApi } from './api';
import { getSocket } from '@/lib/socket/socket-client';
import { useAuthStore } from '@/stores/auth-store';
import {
  SendMessagePayload,
  StartConversationPayload,
  MessageResponse,
} from '@2becollab/types';

export const MESSAGES_KEYS = {
  all: ['messages'] as const,
  conversations: () => [...MESSAGES_KEYS.all, 'conversations'] as const,
  unreadCount: () => [...MESSAGES_KEYS.all, 'unread-count'] as const,
  messages: (convId: string) => [...MESSAGES_KEYS.all, 'conversation', convId] as const,
};

export function useConversations() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: MESSAGES_KEYS.conversations(),
    queryFn: () => messagesApi.getConversations(),
    enabled: isAuthenticated,
  });

  // Socket listener for new messages updating the conversation list
  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = getSocket();

    const handleNewMessage = () => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_KEYS.conversations() });
      queryClient.invalidateQueries({ queryKey: MESSAGES_KEYS.unreadCount() });
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [queryClient, isAuthenticated]);

  return query;
}

export function useUnreadCount() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: MESSAGES_KEYS.unreadCount(),
    queryFn: () => messagesApi.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 30000 : false,
  });
}

export function useConversationMessages(conversationId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: MESSAGES_KEYS.messages(conversationId || ''),
    queryFn: () => messagesApi.getMessages(conversationId!),
    enabled: !!conversationId,
  });

  // Join room and listen for real-time messages in this conversation
  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    socket.emit('join_conversation', { conversationId });

    const handleNewMessage = (msg: MessageResponse) => {
      if (msg.conversationId === conversationId) {
        queryClient.setQueryData(
          MESSAGES_KEYS.messages(conversationId),
          (oldData: any) => {
            if (!oldData) return { items: [msg], pagination: { total: 1 } };
            // Avoid duplicate if already added
            if (oldData.items.some((m: MessageResponse) => m.id === msg.id)) {
              return oldData;
            }
            return {
              ...oldData,
              items: [...oldData.items, msg],
            };
          },
        );
      }
    };

    const handleMessagesRead = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        queryClient.setQueryData(
          MESSAGES_KEYS.messages(conversationId),
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((m: MessageResponse) => ({
                ...m,
                isRead: true,
              })),
            };
          },
        );
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.emit('leave_conversation', { conversationId });
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [conversationId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      payload,
    }: {
      conversationId: string;
      payload: SendMessagePayload;
    }) => messagesApi.sendMessage(conversationId, payload),
    onSuccess: (_newMsg, variables) => {
      // Emit via socket for instant broadcast
      const socket = getSocket();
      socket.emit('send_message', {
        conversationId: variables.conversationId,
        content: variables.payload.content,
        attachments: variables.payload.attachments,
      });

      queryClient.invalidateQueries({
        queryKey: MESSAGES_KEYS.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGES_KEYS.conversations(),
      });
    },
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StartConversationPayload) =>
      messagesApi.startConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MESSAGES_KEYS.conversations(),
      });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) =>
      messagesApi.markAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      const socket = getSocket();
      socket.emit('mark_as_read', { conversationId });

      queryClient.invalidateQueries({
        queryKey: MESSAGES_KEYS.conversations(),
      });
      queryClient.invalidateQueries({
        queryKey: MESSAGES_KEYS.unreadCount(),
      });
    },
  });
}
