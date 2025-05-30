
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, AuthContextType } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Create auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("apuntea_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // This would normally be an API call to a backend
      // For demo purposes, we're using hardcoded credentials
      // Using case-insensitive comparison for email
      if (email.toLowerCase() === "admin@apuntea.com" && password === "1admin?") {
        const user: User = { 
          id: "1",
          email,
          name: "Admin",
          role: "admin",
          isAuthenticated: true
        };
        setUser(user);
        localStorage.setItem("apuntea_user", JSON.stringify(user));
        toast({
          title: "Login successful",
          description: "Welcome to Apuntea Invoice Tracker",
        });
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please check your credentials";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("apuntea_user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user?.isAuthenticated, 
      login, 
      logout, 
      error,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
