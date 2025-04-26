
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Clock, 
  Calendar, 
  User, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TASK_STATUS } from '@/lib/constants';
import CommentSection from './CommentSection';

const TaskCard = ({ task, showComments = false }) => {
  const { updateTask } = useTask();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(showComments);
  const [statusLoading, setStatusLoading] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleStatusChange = async (newStatus) => {
    if (task.status === newStatus) return;
    
    setStatusLoading(true);
    try {
      await updateTask(task.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setStatusLoading(false);
    }
  };
  
  // Choose the badge color based on priority
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="outline" className="task-priority-high">High</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="task-priority-medium">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline" className="task-priority-low">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Choose the status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case TASK_STATUS.IN_PROGRESS:
        return <Badge className="status-in-progress">{status}</Badge>;
      case TASK_STATUS.PENDING:
        return <Badge className="status-pending">{status}</Badge>;
      case TASK_STATUS.COMPLETED:
        return <Badge className="status-completed">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Determine if user can update the task status
  const canUpdateStatus = () => {
    if (user.role === 'Manager') return true;
    if (user.id === task.assignedTo.id) return true;
    return false;
  };
  
  return (
    <Card className="mb-4 transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <div className="flex space-x-2">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-600 mb-4">{task.description}</p>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{task.assignedTo.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setExpanded(!expanded)}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comments</span>
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </div>
        </div>
      </CardContent>
      
      {expanded && <CommentSection taskId={task.id} />}
      
      {canUpdateStatus() && task.status !== TASK_STATUS.COMPLETED && (
        <CardFooter className="pt-2 flex justify-end space-x-2">
          {task.status === TASK_STATUS.PENDING && (
            <Button 
              variant="outline" 
              size="sm" 
              disabled={statusLoading}
              onClick={() => handleStatusChange(TASK_STATUS.IN_PROGRESS)}
            >
              Start Progress
            </Button>
          )}
          <Button 
            variant="default" 
            size="sm"
            disabled={statusLoading}
            onClick={() => handleStatusChange(TASK_STATUS.COMPLETED)}
          >
            Mark Complete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TaskCard;
