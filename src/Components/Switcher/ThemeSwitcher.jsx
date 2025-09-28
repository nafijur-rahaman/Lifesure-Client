import { useContext } from "react";
import { Sun, Moon } from "lucide-react"; 
import { ThemeContext } from "../../Context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle light/dark mode"
      className="cursor-pointer transition-colors duration-300 
                 text-gray-700 dark:text-gray-200"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-indigo-500" />
      )}
    </button>
  );
};

export default ThemeSwitcher;
