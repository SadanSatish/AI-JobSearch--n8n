
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import { LayoutDashboard, Briefcase, FileText, Send, Settings } from 'lucide-react';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 h-screen p-4 flex flex-col">
      <div className="text-xl font-bold text-white mb-8 flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-lg mr-3"></div>
        Career Hub
      </div>
      <nav className="flex-1 space-y-2">
        <Link to="/" className="flex items-center text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </Link>
        <Link to="/opportunities" className="flex items-center text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <Briefcase className="mr-3 h-5 w-5" />
          Opportunities
        </Link>
        <Link to="/resume" className="flex items-center text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <FileText className="mr-3 h-5 w-5" />
          Resumes & ATS
        </Link>
        <Link to="/applications" className="flex items-center text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <Send className="mr-3 h-5 w-5" />
          Applications
        </Link>
      </nav>
      <div className="mt-auto">
        <Link to="/settings" className="flex items-center text-gray-300 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<div className="p-8 text-white">Module coming soon...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
