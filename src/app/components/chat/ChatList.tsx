import { motion } from 'motion/react';
import { MessageCircle, Users } from 'lucide-react';
import { ChatConversation } from '../../types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatListProps {
  conversations: ChatConversation[];
  onSelectConversation: (conversation: ChatConversation) => void;
}

export function ChatList({ conversations, onSelectConversation }: ChatListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation, index) => (
        <motion.button
          key={conversation.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectConversation(conversation)}
          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={conversation.type === 'general' ? 'bg-black text-white' : 'bg-gray-200'}>
                {conversation.type === 'general' ? (
                  <MessageCircle size={20} />
                ) : (
                  <Users size={20} />
                )}
              </AvatarFallback>
            </Avatar>
            {conversation.unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-semibold">{conversation.unreadCount}</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold truncate">{conversation.name}</p>
              {conversation.lastMessageTime && (
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true, locale: ptBR })}
                </span>
              )}
            </div>
            {conversation.lastMessage && (
              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
