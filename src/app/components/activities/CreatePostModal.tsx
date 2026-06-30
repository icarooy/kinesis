import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, image?: string) => void;
  authorName: string;
}

export function CreatePostModal({ isOpen, onClose, onSubmit, authorName }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content, imageUrl || undefined);
      setContent('');
      setImageUrl('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold">Criar Publicação</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div>
                <p className="font-semibold mb-2">{authorName}</p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="O que você quer compartilhar?"
                  className="w-full min-h-32 resize-none outline-none text-gray-900"
                  autoFocus
                />
              </div>

              {imageUrl && (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full rounded-lg max-h-64 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL da imagem (opcional)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-black transition-colors text-sm"
                />
                <Button variant="outline" size="icon">
                  <ImageIcon size={18} />
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Button 
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
              >
                Publicar
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
