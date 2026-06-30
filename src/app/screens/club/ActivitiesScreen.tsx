import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { PostCard } from '../../components/activities/PostCard';
import { CreatePostModal } from '../../components/activities/CreatePostModal';
import { Button } from '../../components/ui/button';

export default function ActivitiesScreen() {
  const { posts, addPost, likePost, addComment } = useAppData();
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  // Mock user ID - in real app, this would come from auth context
  const currentUserId = 'club1';
  const currentUserName = 'Esportiva FC';

  const handleCreatePost = (content: string, image?: string) => {
    addPost({
      authorId: currentUserId,
      authorName: currentUserName,
      authorAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EFC',
      content,
      image,
    });
  };

  const handleLike = (postId: string) => {
    likePost(postId, currentUserId);
  };

  const handleAddComment = (postId: string) => {
    // This would be implemented with a comment input modal
    addComment(postId, {
      authorId: currentUserId,
      authorName: currentUserName,
      content: 'Comentário de exemplo!',
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Atividades</h1>
            <Button
              onClick={() => setShowCreatePost(true)}
              size="icon"
              className="rounded-full bg-black text-white hover:bg-gray-800"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>

        {/* Feed */}
        <div className="max-w-2xl mx-auto p-4">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-12 text-center"
            >
              <p className="text-gray-500 mb-4">Nenhuma publicação ainda</p>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Plus size={18} className="mr-2" />
                Criar Primeira Publicação
              </Button>
            </motion.div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleAddComment}
              />
            ))
          )}
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        authorName={currentUserName}
      />
    </>
  );
}
