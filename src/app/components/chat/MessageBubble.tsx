import { motion } from 'motion/react';
import { Message } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar: boolean;
}

export function MessageBubble({ message, isOwnMessage, showAvatar }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isOwnMessage && (
        <div className="w-8">
          {showAvatar && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.authorAvatar} />
              <AvatarFallback>{message.authorName[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && showAvatar && (
          <span className="text-xs font-medium text-gray-600 mb-1 ml-2">
            {message.authorName}
          </span>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-black text-white rounded-tr-sm'
              : 'bg-white text-gray-900 rounded-tl-sm'
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>
        
        <span className="text-xs text-gray-500 mt-1 mx-2">
          {format(message.createdAt, 'HH:mm')}
        </span>
      </div>

      {isOwnMessage && <div className="w-8" />}
    </motion.div>
  );
}
