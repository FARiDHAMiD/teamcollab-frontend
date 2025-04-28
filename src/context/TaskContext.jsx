import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import AxiosInstance from "../components/utils/AxiosInstance";

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const getTasks = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("tasks/");
      setTasks(response.data); // Set tasks directly
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Fallback to mock data if API fails
      await loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const getComments = async () => {
    let response = await AxiosInstance.get(`comments/`);
    setComments(response.data);
  };

  // Load initial mock data
  useEffect(() => {
    if (user) {
      getTasks();
      getComments();
    }
    // Simulate API call to fetch tasks
    const fetchInitialData = async () => {
      try {
        // In a real app, these would be separate API calls
        await loadMockData();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [user]);

  // Load mock data
  const loadMockData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // // Mock tasks
    // const mockTasks = [
    //   {
    //     id: 1,
    //     title: "Implement User Authentication",
    //     description: "Create a secure authentication system with JWT tokens",
    //     status: TASK_STATUS.IN_PROGRESS,
    //     priority: TASK_PRIORITY.HIGH,
    //     assigned_to: { id: 2, name: "Jane developer", role: "developer" },
    //     created_by: { id: 1, name: "John manager", role: "manager" },
    //     created_at: "2023-11-01T10:00:00Z",
    //     dueDate: "2023-11-10T17:00:00Z",
    //   },
    //   {
    //     id: 2,
    //     title: "Test Login Functionality",
    //     description:
    //       "Perform thorough testing of the login and registration flows",
    //     status: TASK_STATUS.PENDING,
    //     priority: TASK_PRIORITY.MEDIUM,
    //     assigned_to: { id: 3, name: "Mark tester", role: "tester" },
    //     created_by: { id: 1, name: "John manager", role: "manager" },
    //     created_at: "2023-11-02T09:30:00Z",
    //     dueDate: "2023-11-12T17:00:00Z",
    //   },
    //   {
    //     id: 3,
    //     title: "Design Task Management UI",
    //     description:
    //       "Create wireframes and UI components for the task management interface",
    //     status: TASK_STATUS.COMPLETED,
    //     priority: TASK_PRIORITY.MEDIUM,
    //     assigned_to: { id: 2, name: "Jane developer", role: "developer" },
    //     created_by: { id: 1, name: "John manager", role: "manager" },
    //     created_at: "2023-11-01T11:20:00Z",
    //     dueDate: "2023-11-08T17:00:00Z",
    //   },
    //   {
    //     id: 4,
    //     title: "API Documentation",
    //     description:
    //       "Document all API endpoints with request and response examples",
    //     status: TASK_STATUS.IN_PROGRESS,
    //     priority: TASK_PRIORITY.LOW,
    //     assigned_to: { id: 2, name: "Jane developer", role: "developer" },
    //     created_by: { id: 1, name: "John manager", role: "manager" },
    //     created_at: "2023-11-03T13:15:00Z",
    //     dueDate: "2023-11-18T17:00:00Z",
    //   },
    //   {
    //     id: 5,
    //     title: "Fix Notification Bug",
    //     description: "Notifications are not showing real-time updates properly",
    //     status: TASK_STATUS.PENDING,
    //     priority: TASK_PRIORITY.HIGH,
    //     assigned_to: { id: 2, name: "Jane developer", role: "developer" },
    //     created_by: { id: 1, name: "John manager", role: "manager" },
    //     created_at: "2023-11-04T09:45:00Z",
    //     dueDate: "2023-11-09T17:00:00Z",
    //   },
    // ];

    // Mock comments
    const mockComments = [
      {
        id: 1,
        task: 1,
        author: { id: 2, username: "Jane developer", role: "developer" },
        content:
          "I'm working on implementing JWT authentication. Should be done by tomorrow.",
        created_at: "2023-11-03T14:22:00Z",
      },
      {
        id: 2,
        task: 1,
        author: { id: 1, username: "John manager", role: "manager" },
        content:
          "Great! Make sure to include refresh token functionality. @Jane developer",
        created_at: "2023-11-03T15:45:00Z",
      },
      {
        id: 3,
        task: 2,
        author: { id: 3, username: "Mark tester", role: "tester" },
        content:
          "I've started the testing process and found a few edge cases we need to handle.",
        created_at: "2023-11-04T10:12:00Z",
      },
      {
        id: 4,
        task: 3,
        author: { id: 2, username: "Jane developer", role: "developer" },
        content: "UI components are completed and ready for review.",
        created_at: "2023-11-05T16:30:00Z",
      },
      {
        id: 5,
        task: 3,
        author: { id: 1, username: "John manager", role: "manager" },
        content: "They look great! @Mark tester can you verify usability?",
        created_at: "2023-11-05T17:15:00Z",
      },
    ];

    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        userId: user?.user_id || 1,
        text: 'You have been assigned a new task: "Implement User Authentication"',
        isRead: false,
        created_at: "2023-11-01T10:05:00Z",
      },
      {
        id: 2,
        userId: user?.user_id || 1,
        text: "John manager mentioned you in a comment",
        isRead: true,
        created_at: "2023-11-03T15:46:00Z",
      },
      {
        id: 3,
        userId: user?.user_id || 1,
        text: 'Task "Design Task Management UI" has been marked as completed',
        isRead: false,
        created_at: "2023-11-05T16:35:00Z",
      },
    ];

    // setTasks(mockTasks);
    // setComments(mockComments);
    setNotifications(mockNotifications);
  };

  // Add a new task
  const addTask = async (taskData) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTask = {
        id: Date.now(),
        ...taskData,
        created_by: user,
        created_at: new Date().toISOString(),
      };

      setTasks((prevTasks) => [newTask, ...prevTasks]);

      // Create notification for assigned user
      if (taskData.assigned_to) {
        addNotification({
          userId: taskData.assigned_to.id,
          text: `You have been assigned a new task: "${taskData.title}"`,
        });
      }

      toast({
        title: "Task Created",
        description: "The task has been successfully created.",
      });

      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task. Please try again.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (taskId, updatedData) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const taskIndex = tasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) {
        throw new Error("Task not found");
      }

      const oldTask = tasks[taskIndex];
      const updatedTask = { ...oldTask, ...updatedData };

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = updatedTask;

      setTasks(updatedTasks);

      // Create notifications for status changes
      if (updatedData.status && updatedData.status !== oldTask.status) {
        addNotification({
          userId: oldTask.assigned_to.id,
          text: `Task "${oldTask.title}" has been updated to ${updatedData.status}`,
        });
      }

      // Create notifications for reassignment
      if (
        updatedData.assigned_to &&
        updatedData.assigned_to.id !== oldTask.assigned_to.id
      ) {
        addNotification({
          userId: updatedData.assigned_to.id,
          text: `You have been assigned to the task: "${oldTask.title}"`,
        });
      }

      toast({
        title: "Task Updated",
        description: "The task has been successfully updated.",
      });

      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task. Please try again.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const taskToDelete = tasks.find((task) => task.id === taskId);

      if (!taskToDelete) {
        throw new Error("Task not found");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      // Also delete associated comments
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.task !== taskId)
      );

      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
      });

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a task
  const addComment = async (taskId, text) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const task = tasks.find((task) => task.id === taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      const newComment = {
        id: Date.now(),
        taskId,
        user,
        text,
        created_at: new Date().toISOString(),
      };

      setComments((prevComments) => [newComment, ...prevComments]);

      // Check for mentions in the comment
      const mentionRegex = /@(\w+\s\w+)/g;
      const mentions = text.match(mentionRegex);

      if (mentions) {
        mentions.forEach((mention) => {
          const username = mention.substring(1); // Remove @ symbol
          // In a real app, you would look up the user ID based on the name
          // For now, we'll use simplified logic
          if (username === task.assigned_to.name) {
            addNotification({
              userId: task.assigned_to.id,
              text: `${user.username} mentioned you in a comment on task "${task.title}"`,
            });
          } else if (username === task.created_by.name) {
            addNotification({
              userId: task.created_by.id,
              text: `${user.username} mentioned you in a comment on task "${task.title}"`,
            });
          }
        });
      }

      toast({
        title: "Comment Added",
        description: "Your comment has been added to the task.",
      });

      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a notification
  const addNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      ...notificationData,
      isRead: false,
      created_at: new Date().toISOString(),
    };

    setNotifications((prevNotifications) => [
      newNotification,
      ...prevNotifications,
    ]);
    return newNotification;
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Get user's tasks
  const getUserTasks = (userId) => {
    return tasks.filter((task) => task.assigned_to.id === userId);
  };

  // Get task by id
  const getTaskById = (taskId) => {
    return tasks.find((task) => task.id === taskId) || null;
  };

  // Get comments for a task
  const getTaskComments = (taskId) => {
    return comments.filter((comment) => comment.task === taskId);
  };

  // Get user's notifications
  const getUserNotifications = (userId) => {
    return notifications.filter(
      (notification) => notification.userId === userId
    );
  };

  // Calculate task statistics
  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "in_progress"
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === "pending"
    ).length;

    const highPriority = tasks.filter(
      (task) => task.priority === "high"
    ).length;
    const mediumPriority = tasks.filter(
      (task) => task.priority === "medium"
    ).length;
    const lowPriority = tasks.filter((task) => task.priority === "low").length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    };
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        comments,
        notifications,
        loading,
        addTask,
        updateTask,
        deleteTask,
        addComment,
        markNotificationAsRead,
        getUserTasks,
        getTaskById,
        getTaskComments,
        getUserNotifications,
        getTaskStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
