import { Pencil } from 'lucide-react';

interface NicheSelectorProps {
  selectedNiche: string;
  onSelect: (niche: string) => void;
  disabled?: boolean;
}

export function NicheSelector({ selectedNiche, onSelect, disabled }: NicheSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Enter Your Niche or Topic</h2>
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
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
              placeholder="e.g., AI Integration, Digital Marketing, Cloud Computing, Leadership..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
              Enter any niche, industry, or topic you want to create content about
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
