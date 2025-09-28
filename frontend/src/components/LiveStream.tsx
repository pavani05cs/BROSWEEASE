import { useEffect, useState } from "react";
import { Activity, CheckCircle, AlertCircle, Loader2, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StreamMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'progress';
  message: string;
  timestamp: Date;
  details?: string;
}

interface LiveStreamProps {
  isActive: boolean;
  progress: number;
  messages: StreamMessage[];
}

export const LiveStream = ({ isActive, progress, messages }: LiveStreamProps) => {
  const [visibleMessages, setVisibleMessages] = useState<StreamMessage[]>([]);

  useEffect(() => {
    if (messages.length > visibleMessages.length) {
      const newMessages = messages.slice(visibleMessages.length);
      newMessages.forEach((msg, idx) => {
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, msg]);
        }, idx * 200); // Stagger the animations
      });
    } else if (messages.length === 0) {
      setVisibleMessages([]);
    }
  }, [messages, visibleMessages.length]);

  const getIcon = (type: StreamMessage['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'progress':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Activity className="w-4 h-4 text-primary" />;
    }
  };

  const getStatusBadge = (type: StreamMessage['type']) => {
    switch (type) {
      case 'success':
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Success</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">Error</Badge>;
      case 'progress':
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Processing</Badge>;
      default:
        return <Badge variant="secondary" className="bg-accent/50">Info</Badge>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 fade-slide-in">
      <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-background-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 ${isActive ? 'animate-pulse-glow' : ''}`}>
                <Zap className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-semibold text-lg">
                  {isActive ? 'AI Agent Active' : 'AI Agent Ready'}
                </h3>
              </div>
              {isActive && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              )}
            </div>
            
            {isActive && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {progress}% Complete
              </Badge>
            )}
          </div>
          
          {/* Progress Bar */}
          {isActive && (
            <div className="mt-3">
              <Progress 
                value={progress} 
                className="h-2 bg-muted"
              />
            </div>
          )}
        </div>

        {/* Stream Content */}
        <div className="p-6 max-h-96 overflow-y-auto space-y-3">
          {visibleMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>Waiting for search query...</p>
              <p className="text-sm mt-1">The AI agent will show real-time updates here</p>
            </div>
          ) : (
            visibleMessages.map((message, idx) => (
              <div
                key={message.id}
                className="flex items-start gap-3 p-4 bg-background-secondary/20 rounded-xl border border-border/50 hover:bg-background-secondary/40 transition-all duration-200 animate-fade-slide-in hover-lift"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(message.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm">{message.message}</p>
                    {getStatusBadge(message.type)}
                  </div>
                  
                  {message.details && (
                    <p className="text-sm text-muted-foreground mt-1">{message.details}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground/70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};