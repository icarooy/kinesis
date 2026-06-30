import { motion } from 'motion/react';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Post } from '../../types';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

export function PostCard({ post, currentUserId, onLike, onComment }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const hasLiked = post.likes.includes(currentUserId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>{post.authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{post.authorName}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical size={18} />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="w-full">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 group"
          >
            <Heart 
              size={22} 
              className={`transition-colors ${
                hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {post.likes.length}
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <MessageCircle size={22} />
            <span className="text-sm font-medium text-gray-700">
              {post.comments.length}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Comments */}
      {showComments && post.comments.length > 0 && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          {post.comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} />
                <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-sm text-gray-900">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-3">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>Eu</AvatarFallback>
            </Avatar>
            <input
              type="text"
              placeholder="Escreva um comentário..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:bg-gray-200 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  onComment(post.id);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
