import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useMarkAsRead,
} from '@/features/messages/hooks';
import { useAuthStore } from '@/stores/auth-store';
import { getSocket } from '@/lib/socket/socket-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Send,
  Search,
  Check,
  CheckCheck,
  Briefcase,
  User as UserIcon,
  Loader2,
} from 'lucide-react';
import { ConversationResponse, UserRole } from '@2becollab/types';

export function MessagesPage() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedConvId = searchParams.get('id');

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const { data: conversations = [], isLoading: isLoadingConvs } = useConversations();
  const { data: messagesData, isLoading: isLoadingMsgs } = useConversationMessages(selectedConvId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConversation = conversations.find(
    (c: ConversationResponse) => c.id === selectedConvId,
  );

  // Mark active conversation messages as read
  useEffect(() => {
    if (selectedConvId && activeConversation && activeConversation.unreadCount > 0) {
      markAsReadMutation.mutate(selectedConvId);
    }
  }, [selectedConvId, activeConversation?.unreadCount]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.items]);

  // Listen for typing indicator events via socket
  useEffect(() => {
    if (!selectedConvId) return;

    const socket = getSocket();

    const handleUserTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === selectedConvId && data.userId !== user?.id) {
        setOtherUserTyping(true);
      }
    };

    const handleUserStopTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === selectedConvId && data.userId !== user?.id) {
        setOtherUserTyping(false);
      }
    };

    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [selectedConvId, user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!selectedConvId) return;
    const socket = getSocket();

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing_start', { conversationId: selectedConvId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing_stop', { conversationId: selectedConvId });
    }, 1500);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId || sendMessageMutation.isPending) return;

    const content = inputText.trim();
    setInputText('');

    if (isTyping) {
      setIsTyping(false);
      const socket = getSocket();
      socket.emit('typing_stop', { conversationId: selectedConvId });
    }

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConvId,
        payload: { content },
      });
    } catch (err: any) {
      alert('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter((c: ConversationResponse) => {
    const name = c.otherParticipant.fullName.toLowerCase();
    const comp = (c.otherParticipant.companyName || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || comp.includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">Direct Messages</h1>
        <p className="text-xs text-gray-400">
          Chat in real-time with creators and brand partners
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[75vh] min-h-[550px]">
        {/* Left Column: Conversations List */}
        <Card
          variant="glass"
          padding="none"
          className="md:col-span-4 flex flex-col h-full overflow-hidden border border-white/10"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-white/5 border-white/10"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {isLoadingConvs ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-400 text-xs">
                {searchQuery ? 'No matching conversations' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map((conv: ConversationResponse) => {
                const isSelected = conv.id === selectedConvId;
                const other = conv.otherParticipant;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSearchParams({ id: conv.id })}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {other.avatarUrl ? (
                        <img
                          src={other.avatarUrl}
                          alt={other.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                          {other.fullName.charAt(0)}
                        </div>
                      )}
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">
                          {other.fullName}
                        </span>
                        <span className="text-[10px] text-gray-500 flex-shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            other.role === UserRole.BUSINESS
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-purple-500/15 text-purple-300'
                          }`}
                        >
                          {other.role === UserRole.BUSINESS ? 'Brand' : 'Creator'}
                        </span>
                        {other.companyName && (
                          <span className="text-[10px] text-gray-400 truncate">
                            {other.companyName}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-400 truncate">
                        {conv.lastMessageText || 'No messages yet'}
                      </p>

                      {conv.campaign && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-300">
                          <Briefcase className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{conv.campaign.title}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Column: Active Conversation */}
        <Card
          variant="glass"
          padding="none"
          className="md:col-span-8 flex flex-col h-full overflow-hidden border border-white/10"
        >
          {selectedConvId && activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 px-5 border-b border-white/10 flex items-center justify-between gap-3 bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  {activeConversation.otherParticipant.avatarUrl ? (
                    <img
                      src={activeConversation.otherParticipant.avatarUrl}
                      alt={activeConversation.otherParticipant.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                      {activeConversation.otherParticipant.fullName.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {activeConversation.otherParticipant.fullName}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {activeConversation.otherParticipant.headline ||
                        activeConversation.otherParticipant.companyName ||
                        (activeConversation.otherParticipant.role === UserRole.BUSINESS
                          ? 'Brand Partner'
                          : 'Creator')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeConversation.otherParticipant.role === UserRole.CREATOR && (
                    <Link
                      to={`/creators/${activeConversation.otherParticipant.id}`}
                      className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </Link>
                  )}
                  {activeConversation.campaign && (
                    <Link
                      to={`/campaigns/${activeConversation.campaign.id}`}
                      className="text-xs flex items-center gap-1 text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                      <span>Brief</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoadingMsgs ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  </div>
                ) : messagesData?.items.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 text-xs">
                    Start the conversation by sending a message below!
                  </div>
                ) : (
                  messagesData?.items.map((msg) => {
                    const isMine = msg.senderId === user?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                            isMine
                              ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/20'
                              : 'bg-white/10 text-gray-100 rounded-bl-sm border border-white/5'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>

                        <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-500">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMine && (
                            <span>
                              {msg.isRead ? (
                                <CheckCheck className="w-3 h-3 text-emerald-400 inline" />
                              ) : (
                                <Check className="w-3 h-3 text-gray-400 inline" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {otherUserTyping && (
                  <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span>{activeConversation.otherParticipant.fullName} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-white/10 flex items-center gap-2 bg-white/[0.02]"
              >
                <Input
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type a message... (Press Enter to send)"
                  className="flex-1 text-xs bg-white/5 border-white/10"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!inputText.trim() || sendMessageMutation.isPending}
                  className="px-4 shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                <MessageSquare className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Select a Conversation</h3>
              <p className="text-xs max-w-sm">
                Choose a conversation from the sidebar or click "Message" on any creator profile or campaign brief to start chatting.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
