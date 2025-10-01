import { Brain, Code2, Database, Pencil } from 'lucide-react';

interface NicheSelectorProps {
  selectedNiche: string;
  onSelect: (niche: string) => void;
  disabled?: boolean;
}

const quickNiches = [
  {
    value: 'AI Integration',
    label: 'AI Integration',
    icon: Brain,
    description: 'AI solutions and integration expertise',
  },
  {
    value: 'Google Apps Script',
    label: 'Google Apps Script',
    icon: Code2,
    description: 'Google Workspace automation',
  },
  {
    value: 'Data Management Automation',
    label: 'Data Management',
    icon: Database,
    description: 'Data automation and management',
  },
];

export function NicheSelector({ selectedNiche, onSelect, disabled }: NicheSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Niche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickNiches.map(({ value, label, icon: Icon, description }) => (
            <button
              key={value}
              onClick={() => onSelect(value)}
              disabled={disabled}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedNiche === value
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedNiche === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-50 text-gray-500 font-medium">OR</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Custom Topic</h2>
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Pencil className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <label htmlFor="niche-input" className="block text-sm font-medium text-gray-700 mb-2">
                What topic do you want to create LinkedIn posts about?
              </label>
              <textarea
                id="niche-input"
                value={selectedNiche}
                onChange={(e) => onSelect(e.target.value)}
                disabled={disabled}
                placeholder="e.g., Digital Marketing, Cloud Computing, Leadership, Cybersecurity..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter any niche, industry, or topic you want to create content about
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
