import { useState, useEffect } from 'react';
import { useSSESearch } from '@/hooks/use-websocket';
import { SearchRequest } from '@/hooks/use-api';
import { LiveStream } from './LiveStream';
import { ResultsTable } from './ResultsTable';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface StreamMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'progress';
  message: string;
  timestamp: Date;
  details?: string;
}

interface SearchResultsProps {
  initialQuery?: string;
}

export const SearchResults = ({ initialQuery }: SearchResultsProps) => {
  const {
    search,
    cancelSearch,
    results,
    partialResults,
    progress,
    error,
    loading,
    logs
  } = useSSESearch();

  const [streamMessages, setStreamMessages] = useState<StreamMessage[]>([]);
  const [progressValue, setProgressValue] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);

  // Handle initial query if provided
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  // Update stream messages based on logs and progress
  useEffect(() => {
    if (!logs.length) return;
    
    const newMessages = logs.map((log, index) => ({
      id: `log-${Date.now()}-${index}`,
      type: log.includes('Error') ? 'error' : 
            log.includes('completed') ? 'success' :
            log.includes('Progress') ? 'progress' : 'info',
      message: log,
      timestamp: new Date(),
    }));
    
    setStreamMessages(prev => {
      // Filter out duplicates
      const existingMessages = new Set(prev.map(m => m.message));
      const uniqueNewMessages = newMessages.filter(m => !existingMessages.has(m.message));
      return [...prev, ...uniqueNewMessages];
    });
  }, [logs]);

  // Update progress value
  useEffect(() => {
    if (progress) {
      setProgressValue(progress.progress || 0);
      
      // Add progress message if significant change
      if (progress.message && progress.status !== 'error') {
        const messageType = 
          progress.status === 'completed' ? 'success' :
          progress.status === 'cancelled' ? 'warning' : 'progress';
          
        setStreamMessages(prev => {
          // Avoid duplicate progress messages
          if (prev.some(m => m.message === progress.message)) return prev;
          
          return [...prev, {
            id: `progress-${Date.now()}`,
            type: messageType,
            message: progress.message,
            timestamp: new Date()
          }];
        });
      }
    }
  }, [progress]);

  // Update displayed products from results or partial results
  useEffect(() => {
    if (results && results.products) {
      setDisplayedProducts(results.products.map(product => ({
        ...product,
        id: product.id || `product-${Date.now()}-${Math.random()}`,
        isTopPick: product.recommended || false
      })));
    } else if (partialResults && partialResults.length > 0) {
      setDisplayedProducts(partialResults.map(product => ({
        ...product,
        id: product.id || `product-${Date.now()}-${Math.random()}`,
        isTopPick: product.recommended || false
      })));
    }
  }, [results, partialResults]);

  // Handle search submission
  const handleSearch = (query: string) => {
    setStreamMessages([]);
    setProgressValue(0);
    setDisplayedProducts([]);
    
    const request: SearchRequest = {
      query,
      max_results: 10
    };
    
    search(request);
  };

  // Handle search cancellation
  const handleCancel = () => {
    cancelSearch();
    setStreamMessages(prev => [
      ...prev,
      {
        id: `cancel-${Date.now()}`,
        type: 'warning',
        message: 'Search cancelled by user',
        timestamp: new Date()
      }
    ]);
  };

  // Handle retry on error
  const handleRetry = () => {
    if (!results && !partialResults.length) {
      setStreamMessages([]);
      setProgressValue(0);
      
      const lastQuery = streamMessages.find(m => m.message.includes('Search initiated:'))?.message.replace('Search initiated: ', '');
      if (lastQuery) {
        handleSearch(lastQuery);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Live Stream Section */}
      <LiveStream 
        isActive={loading} 
        progress={progressValue} 
        messages={streamMessages}
      />
      
      {/* Cancel Button (only show when loading) */}
      {loading && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Search
          </Button>
        </div>
      )}
      
      {/* Results Table */}
      {(displayedProducts.length > 0 || loading) && (
        <ResultsTable 
          results={displayedProducts} 
          isLoading={loading && displayedProducts.length === 0}
        />
      )}
    </div>
  );
};