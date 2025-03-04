import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Book } from 'lucide-react';

interface IslandState {
  message: ReactNode;
  icon?: ReactNode;
  backgroundColor?: string;
  textColor?: string;
  isVisible: boolean;
}

interface IslandContextType {
  state: IslandState;
  showMessage: (
    content: ReactNode, 
    options?: { 
      icon?: ReactNode; 
      backgroundColor?: string; 
      textColor?: string;
      duration?: number;
    }
  ) => Promise<void>;
}

const defaultState: IslandState = {
  message: 'Welcome to StudyLabs Beta',
  isVisible: false, // Changed to true by default
  icon: <Book size={18} />, // Default Book icon
  backgroundColor: 'var(--island-bg, rgba(0, 0, 0, 0.8))',
  textColor: 'white'
};

const defaultContext: IslandContextType = {
  state: defaultState,
  showMessage: async () => {},
};

export const IslandContext = createContext<IslandContextType>(defaultContext);

export const IslandProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IslandState>(defaultState);

  // Update the background color based on theme
  React.useEffect(() => {
    const updateThemeColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      document.documentElement.style.setProperty(
        '--island-bg', 
        isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(0, 0, 0, 0.8)'
      );
    };
    
    updateThemeColors();
    
    // Listen for theme changes
    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  const showMessage = useCallback(async (
    content: ReactNode, 
    options?: {
      icon?: ReactNode;
      backgroundColor?: string;
      textColor?: string;
      duration?: number;
    }
  ): Promise<void> => {
    setState(prev => ({ 
      ...prev, 
      message: content, 
      icon: options?.icon,
      backgroundColor: options?.backgroundColor || defaultState.backgroundColor,
      textColor: options?.textColor || defaultState.textColor,
      isVisible: true 
    }));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          message: defaultState.message,
          icon: defaultState.icon,
          backgroundColor: defaultState.backgroundColor,
          textColor: defaultState.textColor,
          isVisible: true // Keep visible with default content
        }));
        resolve();
      }, options?.duration || 2000);
    });
  }, []);

  return (
    <IslandContext.Provider value={{ state, showMessage }}>
      {children}
    </IslandContext.Provider>
  );
};