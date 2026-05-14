import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'primary',
}: StatsCardProps) {
  const colorClasses = {
    primary: 'text-[#00AD51] bg-[#00AD511A]',
    secondary: 'text-[#00246B] bg-[#00246B1A]',
    accent: 'text-[#0D5EBA] bg-[#0D5EBA1A]',
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
