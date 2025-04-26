
import { useState, useEffect, useRef } from 'react';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const CommentSection = ({ taskId }) => {
  const { getTaskComments, addComment } = useTask();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Fetch comments for this task
    const taskComments = getTaskComments(taskId);
    setComments(taskComments);
  }, [taskId, getTaskComments]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const commentResult = await addComment(taskId, newComment);
      if (commentResult) {
        setComments(prev => [commentResult, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Parse the text and render mentions with special styling
  const renderCommentWithMentions = (text) => {
    const mentionRegex = /@(\w+\s\w+)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a mention
        return <span key={index} className="mention">@{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };
  
  return (
    <div className="px-6 pb-4">
      <div className="mb-3 max-h-60 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="mb-3">
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{comment.user.name}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm">{renderCommentWithMentions(comment.text)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">No comments yet</p>
        )}
      </div>
      
      <form onSubmit={handleCommentSubmit} className="flex space-x-2">
        <Input
          ref={inputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          disabled={submitting}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={submitting || !newComment.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default CommentSection;
