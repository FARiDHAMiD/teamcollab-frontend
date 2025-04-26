
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user data is in localStorage
    const userData = localStorage.getItem('taskhive_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('taskhive_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate authentication with mock data
      
      // Mock user data based on email (in a real app, this would come from your API)
      const mockUsers = {
        'manager@taskhive.com': { id: 1, name: 'John Manager', email: 'manager@taskhive.com', role: 'Manager' },
        'developer@taskhive.com': { id: 2, name: 'Jane Developer', email: 'developer@taskhive.com', role: 'Developer' },
        'tester@taskhive.com': { id: 3, name: 'Mark Tester', email: 'tester@taskhive.com', role: 'Tester' },
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = mockUsers[email];
      
      if (userData && password === 'password') {
        // Success login
        setUser(userData);
        localStorage.setItem('taskhive_user', JSON.stringify(userData));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userData.name}!`,
        });
        navigate('/dashboard');
        return true;
      } else {
        // Failed login
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem('taskhive_user', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to TaskHive, ${name}!`,
      });
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskhive_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
