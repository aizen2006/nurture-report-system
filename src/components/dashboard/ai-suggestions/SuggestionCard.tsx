
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SuggestionCardProps {
  type: 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

const SuggestionCard = ({ type, icon, message, priority }: SuggestionCardProps) => {
  const getCardStyle = (type: string, priority: string) => {
    const baseStyle = "p-4 rounded-lg border-l-4 ";
    
    if (priority === 'high') {
      return baseStyle + "bg-red-50 border-l-red-500";
    } else if (type === 'warning') {
      return baseStyle + "bg-yellow-50 border-l-yellow-500";
    } else if (type === 'success') {
      return baseStyle + "bg-green-50 border-l-green-500";
    } else {
      return baseStyle + "bg-blue-50 border-l-blue-500";
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600';
    if (type === 'warning') return 'text-yellow-600';
    if (type === 'success') return 'text-green-600';
    return 'text-blue-600';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 text-xs">🚨 High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">⚠️ Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 text-xs">✅ Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className={getCardStyle(type, priority)}>
      <div className="flex items-start gap-3">
        <div className={getIconColor(type, priority)}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800 mb-2">{message}</p>
          {getPriorityBadge(priority)}
        </div>
      </div>
    </div>
  );
};

export default SuggestionCard;
