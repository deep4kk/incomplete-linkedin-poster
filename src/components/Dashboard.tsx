import { FileText, CheckCircle, Send, XCircle, TrendingUp } from 'lucide-react';
import { Stats } from '../types';

interface DashboardProps {
  stats: Stats;
}

export function Dashboard({ stats }: DashboardProps) {
  const cards = [
    {
      label: 'Total Posts',
      value: stats.total,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Generated',
      value: stats.generated,
      icon: TrendingUp,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Posted',
      value: stats.posted,
      icon: Send,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(({ label, value, icon: Icon, color, textColor, bgColor }) => (
          <div key={label} className={`${bgColor} rounded-xl p-4 border border-gray-200`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`${color} p-2 rounded-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className={`text-3xl font-bold ${textColor} mb-1`}>{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
