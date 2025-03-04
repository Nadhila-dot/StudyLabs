import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

export function ToggleThemeSwitch() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Get initial theme preference from localStorage
    const darkModePreference = localStorage.getItem('dark-mode') === 'true';
    setIsDarkMode(darkModePreference);
    
    // Apply theme based on preference
    if (darkModePreference) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <div className="flex items-center space-x-4">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-zinc-600"
      />
      <span className="text-zinc-600 dark:text-zinc-400">
        {isDarkMode ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </span>
    </div>
  );
}

export default ToggleThemeSwitch;