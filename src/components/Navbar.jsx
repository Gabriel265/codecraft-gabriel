import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow p-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-300">
          CodeCraft
        </Link>
        <div className="flex gap-4">
          <Link to="/tutorials" className="hover:underline">Tutorials</Link>
          <Link to="/ideas" className="hover:underline">Idea Lab</Link>
          <Link to="/components" className="hover:underline">Components</Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:scale-105"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
