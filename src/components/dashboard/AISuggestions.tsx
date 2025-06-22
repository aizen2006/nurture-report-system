
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import SuggestionCard from './ai-suggestions/SuggestionCard';
import { generateSuggestions } from './ai-suggestions/SuggestionGenerator';

const AISuggestions = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['form_submissions_ai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }
      return data;
    },
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['form_submissions_ai'] });
      // Add a delay to show the refresh animation
      setTimeout(() => setIsRefreshing(false), 1500);
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              AI-Based Suggestions
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load suggestions</p>
            <p className="text-sm text-gray-500 mt-1">Please check your connection and try again</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const suggestions = generateSuggestions(submissions || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            AI-Based Suggestions
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reanalyze
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Analyzing data...</span>
          </div>
        ) : (
          <>
            {suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                type={suggestion.type}
                icon={suggestion.icon}
                message={suggestion.message}
                priority={suggestion.priority}
              />
            ))}
            
            <div className="text-xs text-gray-500 border-t pt-3">
              <p>Last updated: {new Date().toLocaleTimeString()}</p>
              <p>Analyzed {submissions?.length || 0} form submissions</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
