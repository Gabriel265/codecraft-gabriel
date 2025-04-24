import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tutorials from './pages/Tutorials';
import Ideas from './pages/Ideas';
import Components from './pages/Components';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<h1 className="text-3xl">🏠 Welcome to CodeCraft!</h1>} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/components" element={<Components />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
