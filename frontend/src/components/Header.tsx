import { Search, History, HelpCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Header = () => {
  const [searchHistory, setSearchHistory] = useState([
    "Search for mobiles under 20k",
    "Best laptops for gaming",
    "Wireless headphones comparison",
    "Smart TV deals"
  ]);

  const handleSearchClick = () => {
    // Focus on search input if it exists
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    if (searchInput) {
      (searchInput as HTMLElement).focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleHistoryClick = () => {
    // History functionality is handled by the dialog
  };

  const handleHelpClick = () => {
    // Help functionality is handled by the dialog
  };

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50 smooth-enter">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Branding */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-glow"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                BROWSEEASE
              </h1>
              <p className="text-xs text-muted-foreground">AI Web Navigation Agent</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-accent"
              onClick={handleSearchClick}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-accent"
                  onClick={handleHistoryClick}
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Search History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-64 w-full">
                  <div className="space-y-2">
                    {searchHistory.map((query, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-accent/50 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => {
                          const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = query;
                            searchInput.focus();
                          }
                        }}
                      >
                        <p className="text-sm">{query}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-accent"
                  onClick={handleHelpClick}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>How to use BROWSEEASE</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="font-semibold mb-2">Getting Started</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter your search query in natural language, like "Find laptops under $1000" or "Best smartphones for photography".
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Live Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Watch as our AI agent searches across multiple sources in real-time and provides you with the best matches.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Smart Recommendations</h4>
                    <p className="text-sm text-muted-foreground">
                      Get AI-powered summaries and recommendations based on your search criteria and preferences.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Activity className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};