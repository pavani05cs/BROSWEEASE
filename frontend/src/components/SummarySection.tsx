import { Sparkles, ThumbsUp, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SummaryData {
  recommendation: string;
  keyInsights: string[];
  priceRange: {
    min: string;
    max: string;
    average: string;
  };
  topBrands: string[];
  considerations: string[];
}

interface SummarySectionProps {
  summary: SummaryData | null;
  isLoading: boolean;
}

export const SummarySection = ({ summary, isLoading }: SummarySectionProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 fade-slide-in">
      <div className="bg-gradient-to-br from-card to-background-secondary/30 rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Recommendation Summary</h2>
              <p className="text-sm text-muted-foreground">Based on comprehensive analysis</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Recommendation */}
          <div className="p-6 bg-gradient-to-r from-success/10 to-primary/10 rounded-xl border border-success/20">
            <div className="flex items-start gap-3">
              <ThumbsUp className="w-6 h-6 text-success flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">Our Top Recommendation</h3>
                <p className="text-foreground/90 leading-relaxed">{summary.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Grid Layout for Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Insights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Key Insights</h3>
              </div>
              <div className="space-y-3">
                {summary.keyInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-4 bg-background-secondary/30 rounded-lg border border-border/50 hover:bg-background-secondary/50 transition-all duration-200"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    <p className="text-sm text-foreground/90">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Analysis & Brands */}
            <div className="space-y-4">
              {/* Price Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Price Analysis</h3>
                </div>
                <div className="p-4 bg-background-secondary/30 rounded-lg border border-border/50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Min Price</div>
                      <div className="font-semibold text-success">{summary.priceRange.min}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Average</div>
                      <div className="font-semibold text-primary">{summary.priceRange.average}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Max Price</div>
                      <div className="font-semibold text-warning">{summary.priceRange.max}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Brands */}
              <div>
                <h4 className="font-medium mb-3 text-foreground">Popular Brands</h4>
                <div className="flex flex-wrap gap-2">
                  {summary.topBrands.map((brand, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Considerations */}
          {summary.considerations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-lg">Important Considerations</h3>
              </div>
              <div className="space-y-2">
                {summary.considerations.map((consideration, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground/90">{consideration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};