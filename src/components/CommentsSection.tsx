import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import type { CommentEntityType } from '@/types';

interface CommentsSectionProps {
  entityType: CommentEntityType;
  entityId: string;
}

export const CommentsSection = ({ entityType, entityId }: CommentsSectionProps) => {
  const { currentUser, getComments, createComment, deleteComment, users } = useApp();
  const [content, setContent] = useState('');
  const comments = getComments(entityType, entityId);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(entityType, entityId, content);
    setContent('');
  };

  const canDelete = (authorId: string) => {
    return currentUser.role === 'admin' || currentUser.id === authorId;
  };

  return (
    <div className="space-y-4 mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold">Comments</h3>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          className="min-h-[80px]"
        />
        <Button type="submit" size="sm">Post Comment</Button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet</p>
        ) : (
          comments.map(comment => {
            const author = users.find(u => u.id === comment.authorUserId);
            const initials = author?.name.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
            
            return (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{author?.name || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {canDelete(comment.authorUserId) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteComment(comment.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
