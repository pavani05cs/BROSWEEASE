import { Star, ExternalLink, TrendingUp, Award, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductResult {
  id: string;
  source: string;
  name: string;
  price: string;
  originalPrice?: string;
  specs: string[];
  score: number;
  rating?: number;
  reviews?: number;
  image?: string;
  url: string;
  isTopPick?: boolean;
}

interface ResultsTableProps {
  results: ProductResult[];
  isLoading: boolean;
}

export const ResultsTable = ({ results, isLoading }: ResultsTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-background-secondary/20 rounded-xl">
                <div className="w-20 h-20 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="w-16 h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-6 fade-slide-in">
      <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-background-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Top Results</h2>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {results.length} Products Found
            </Badge>
          </div>
        </div>

        {/* Results Grid */}
        <div className="p-6 space-y-4">
          {results.map((result, index) => (
            <div
              key={result.id}
              className={`relative p-6 rounded-xl border transition-all duration-300 hover-lift group ${
                result.isTopPick
                  ? 'bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/30 shadow-lg'
                  : 'bg-background-secondary/20 border-border/50 hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Top Pick Badge */}
              {result.isTopPick && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg">
                    <Award className="w-3 h-3 mr-1" />
                    Top Pick
                  </Badge>
                </div>
              )}

              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                {index + 1}
              </div>

              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-background rounded-xl border border-border/50 flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-all duration-300">
                    {result.image ? (
                      <img 
                        src={result.image} 
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  {/* Source */}
                  <Badge variant="outline" className="mb-2 text-xs">
                    {result.source}
                  </Badge>

                  {/* Product Name */}
                  <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                    {result.name}
                  </h3>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.specs.slice(0, 3).map((spec, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-muted/50 text-muted-foreground"
                      >
                        {spec}
                      </Badge>
                    ))}
                    {result.specs.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-muted/50 text-muted-foreground">
                        +{result.specs.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  {result.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(result.rating!)
                                ? 'text-warning fill-warning'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {result.rating}/5 ({result.reviews?.toLocaleString()} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex-shrink-0 text-right space-y-3">
                  {/* Price */}
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {result.price}
                    </div>
                    {result.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        {result.originalPrice}
                      </div>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {result.score}/10
                    </div>
                    <div className="text-xs text-muted-foreground">AI Score</div>
                  </div>

                  {/* View Product Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 group-hover:shadow-lg"
                    onClick={() => window.open(result.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};