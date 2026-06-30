import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send } from 'lucide-react';
import { Message, ChatConversation } from '../../types';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/button';

interface ChatRoomProps {
  conversation: ChatConversation;
  messages: Message[];
  currentUserId: string;
  currentUserName: string;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}

export function ChatRoom({ 
  conversation, 
  messages, 
  currentUserId, 
  currentUserName, 
  onBack, 
  onSendMessage 
}: ChatRoomProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="font-semibold">{conversation.name}</h2>
          {conversation.type === 'team' && (
            <p className="text-xs text-gray-500">Grupo da turma</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.authorId === currentUserId}
            showAvatar={
              index === 0 || 
              messages[index - 1].authorId !== message.authorId
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:bg-gray-200 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="h-11 w-11 rounded-full bg-black text-white flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
