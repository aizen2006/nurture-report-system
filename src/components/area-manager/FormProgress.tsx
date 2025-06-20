
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface FormProgressProps {
  answeredQuestions: number;
  totalQuestions: number;
}

const FormProgress = ({ answeredQuestions, totalQuestions }: FormProgressProps) => {
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="px-3 py-1">
          {answeredQuestions}/{totalQuestions} completed
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Progress Overview</CardTitle>
            <span className="text-sm text-gray-500">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
      </Card>
    </div>
  );
};

export default FormProgress;
