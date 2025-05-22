import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of the context data
interface ThemeContextData {
  theme: string;
  toggleTheme: () => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

// Define the props for the ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Create the ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // State to manage the current theme
  const [theme, setTheme] = useState<string>(() => {
    // Get the persisted theme from local storage or default to 'light'
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? storedTheme : 'light';
  });

  // Effect to apply the theme to the document and persist it
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextData => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
