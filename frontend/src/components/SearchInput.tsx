import { useState } from "react";
import { Search, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchInput = ({ onSearch, isLoading }: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 fade-slide-in">
      <div className="relative group">
        {/* Glow effect on focus */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-300"></div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-4 bg-card rounded-2xl border border-border p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Search for mobiles under 20k, best laptops for gaming, headphones with noise cancellation..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-muted-foreground/70"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-primary-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Search
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {[
            "Best smartphones under ₹30k",
            "Gaming laptops 2024",
            "Wireless earbuds comparison",
            "4K TVs under ₹50k"
          ].map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(suggestion)}
              className="px-4 py-2 bg-background-secondary rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 border border-border/50 hover:border-primary/30 hover:shadow-md group"
            >
              <Sparkles className="w-3 h-3 inline mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};