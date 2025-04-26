
import { useState, useEffect } from 'react';
import { useTask } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY, USER_ROLES } from '@/lib/constants';

const TaskForm = ({ task, onComplete, onCancel }) => {
  const { addTask, updateTask } = useTask();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.MEDIUM,
    assignedTo: null,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  });
  const [userOptions, setUserOptions] = useState([
    { id: 2, name: 'Jane Developer', role: 'Developer' },
    { id: 3, name: 'Mark Tester', role: 'Tester' },
  ]);
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: new Date(task.dueDate),
      });
    }
  }, [task]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.assignedTo) {
      // Validation failed
      return;
    }
    
    setSubmitting(true);
    try {
      if (task) {
        // Update existing task
        await updateTask(task.id, formData);
      } else {
        // Create new task
        await addTask(formData);
      }
      if (onComplete) onComplete();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TASK_PRIORITY.HIGH}>High</SelectItem>
              <SelectItem value={TASK_PRIORITY.MEDIUM}>Medium</SelectItem>
              <SelectItem value={TASK_PRIORITY.LOW}>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TASK_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={TASK_STATUS.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={TASK_STATUS.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select
            value={formData.assignedTo ? formData.assignedTo.id.toString() : ''}
            onValueChange={(value) => {
              const selectedUser = userOptions.find(u => u.id.toString() === value);
              setFormData(prev => ({ ...prev, assignedTo: selectedUser }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign to user" />
            </SelectTrigger>
            <SelectContent>
              {userOptions.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(formData.dueDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
