import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div 
      onClick={toggleTheme}
      className="relative w-14 h-7 cursor-pointer"
    >
      {/* Track/Rail */}
      <div className={`
        w-full h-full rounded-full border-2 transition-all duration-300 ease-in-out
        ${isDark 
          ? 'bg-primary/20 border-primary/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]' 
          : 'bg-muted border-border shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]'
        }
      `} />
      
      {/* Sliding Thumb/Knob */}
      <div className={`
        absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 ease-in-out
        backdrop-blur-md border shadow-lg transform
        ${isDark 
          ? 'translate-x-7 bg-primary border-primary/50 shadow-primary/20' 
          : 'translate-x-0.5 bg-background border-border shadow-black/10'
        }
      `}>
        {/* Icon Container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* Sun Icon */}
          <Sun className={`
            absolute h-3 w-3 transition-all duration-300 ease-in-out
            ${isDark 
              ? 'opacity-0 scale-75 rotate-90 text-muted-foreground' 
              : 'opacity-100 scale-100 rotate-0 text-primary'
            }
          `} />
          
          {/* Moon Icon */}
          <Moon className={`
            absolute h-3 w-3 transition-all duration-300 ease-in-out
            ${isDark 
              ? 'opacity-100 scale-100 rotate-0 text-primary-foreground' 
              : 'opacity-0 scale-75 -rotate-90 text-muted-foreground'
            }
          `} />
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300 ease-in-out pointer-events-none
        ${isDark 
          ? 'shadow-[0_0_20px_rgba(var(--primary),0.3)]' 
          : 'shadow-none'
        }
      `} />
    </div>
  );
};