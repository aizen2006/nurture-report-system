
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Users, Calendar, Shield } from 'lucide-react';

interface Suggestion {
  type: 'warning' | 'success' | 'info';
  icon: React.ReactNode;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

const AISuggestions = () => {
  const suggestions: Suggestion[] = [
    {
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4" />,
      message: 'Understaffed in Branch A, Room 102. Hire 1 staff for morning shift.',
      priority: 'high'
    },
    {
      type: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
      message: 'Staff and compliance are optimal in Branch C.',
      priority: 'low'
    },
    {
      type: 'warning',
      icon: <Calendar className="h-4 w-4" />,
      message: 'First Aid certification expires in 30 days for 3 staff members.',
      priority: 'medium'
    },
    {
      type: 'info',
      icon: <Users className="h-4 w-4" />,
      message: 'Consider hiring additional staff due to high waitlist demand.',
      priority: 'medium'
    },
    {
      type: 'warning',
      icon: <Shield className="h-4 w-4" />,
      message: 'DBS renewal required for 2 staff members in Branch B.',
      priority: 'high'
    }
  ];

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
        return <Badge className="bg-red-100 text-red-800">🚨 High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">✅ Low Priority</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          AI-Based Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={getCardStyle(suggestion.type, suggestion.priority)}>
            <div className="flex items-start gap-3">
              <div className={getIconColor(suggestion.type, suggestion.priority)}>
                {suggestion.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-2">{suggestion.message}</p>
                {getPriorityBadge(suggestion.priority)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
