import { Linkedin, LogOut } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  onAuthClick: () => void;
}

export function Header({ isAuthenticated, onAuthClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LinkedIn Post Manager</h1>
              <p className="text-xs text-gray-500">AI-Powered Content Creation</p>
            </div>
          </div>

          <button
            onClick={onAuthClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isAuthenticated
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4" />
                Connected
              </>
            ) : (
              <>
                <Linkedin className="w-4 h-4" />
                Connect LinkedIn
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
