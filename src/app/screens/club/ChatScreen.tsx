import { useState } from 'react';
import { motion } from 'motion/react';
import { useAppData } from '../../contexts/AppDataContext';
import { ChatList } from '../../components/chat/ChatList';
import { ChatRoom } from '../../components/chat/ChatRoom';
import { ChatConversation } from '../../types';

export default function ChatScreen() {
  const { conversations, messages, sendMessage } = useAppData();
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  // Mock user data - in real app, this would come from auth context
  const currentUserId = 'club1';
  const currentUserName = 'Coordenador';

  const handleSendMessage = (content: string) => {
    if (selectedConversation) {
      sendMessage(selectedConversation.id, {
        conversationId: selectedConversation.id,
        authorId: currentUserId,
        authorName: currentUserName,
        content,
      });
    }
  };

  const conversationMessages = selectedConversation
    ? messages.filter(m => m.conversationId === selectedConversation.id)
    : [];

  return (
    <div className="h-screen bg-white flex flex-col">
      {!selectedConversation ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-xl font-bold">Conversas</h1>
              <p className="text-sm text-gray-600 mt-1">
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} mensagens não lidas
              </p>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <ChatList
                conversations={conversations}
                onSelectConversation={setSelectedConversation}
              />
            </div>
          </div>
        </>
      ) : (
        <ChatRoom
          conversation={selectedConversation}
          messages={conversationMessages}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onBack={() => setSelectedConversation(null)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
