import { Brain, Code2, Database } from 'lucide-react';
import { Niche } from '../types';

interface NicheSelectorProps {
  selectedNiche: Niche | null;
  onSelect: (niche: Niche) => void;
  disabled?: boolean;
}

const niches: { value: Niche; label: string; icon: any; description: string }[] = [
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Select Your Niche</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {niches.map(({ value, label, icon: Icon, description }) => (
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
  );
}
