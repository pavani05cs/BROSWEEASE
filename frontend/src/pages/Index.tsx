import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchInput } from "@/components/SearchInput";
import { LiveStream } from "@/components/LiveStream";
import { ResultsTable } from "@/components/ResultsTable";
import { SummarySection } from "@/components/SummarySection";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-illustration.png";

interface StreamMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'progress';
  message: string;
  timestamp: Date;
  details?: string;
}

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

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const { toast } = useToast();


  // Category-specific mock data
  const mockMobiles: ProductResult[] = [
    {
      id: "1",
      source: "Amazon",
      name: "Samsung Galaxy A54 5G (Awesome Blue, 128GB)",
      price: "₹26,999",
      originalPrice: "₹32,999",
      specs: ["6.4″ Super AMOLED", "50MP Triple Camera", "5000mAh Battery", "8GB RAM"],
      score: 9.2,
      rating: 4.3,
      reviews: 12543,
      url: "#",
      isTopPick: true
    },
    {
      id: "2",
      source: "Flipkart",
      name: "OnePlus Nord CE 3 Lite (Pastel Lime, 128GB)",
      price: "₹19,999",
      originalPrice: "₹23,999",
      specs: ["6.72″ LCD Display", "108MP Main Camera", "5000mAh Battery", "8GB RAM"],
      score: 8.7,
      rating: 4.1,
      reviews: 8934,
      url: "#"
    },
    {
      id: "3",
      source: "Amazon",
      name: "Xiaomi Redmi Note 12 Pro (Glacier Blue, 128GB)",
      price: "₹23,999",
      originalPrice: "₹27,999",
      specs: ["6.67″ AMOLED", "50MP Triple Camera", "4500mAh Battery", "6GB RAM"],
      score: 8.5,
      rating: 4.2,
      reviews: 15678,
      url: "#"
    },
    {
      id: "4",
      source: "Croma",
      name: "Vivo V27 (Noble Black, 128GB)",
      price: "₹28,999",
      originalPrice: "₹32,999",
      specs: ["6.78″ Curved AMOLED", "50MP Eye Autofocus", "4600mAh Battery", "8GB RAM"],
      score: 8.3,
      rating: 4.0,
      reviews: 5432,
      url: "#"
    },
    {
      id: "5",
      source: "Reliance Digital",
      name: "Realme 11 Pro (Sunrise Beige, 128GB)",
      price: "₹25,999",
      specs: ["6.7″ Curved AMOLED", "100MP Portrait Camera", "5000mAh Battery", "8GB RAM"],
      score: 8.1,
      rating: 3.9,
      reviews: 7865,
      url: "#"
    }
  ];

  const mockLaptops: ProductResult[] = [
    {
      id: "1",
      source: "Amazon",
      name: "HP Pavilion 15 (2024)",
      price: "₹65,999",
      originalPrice: "₹72,999",
      specs: ["15.6″ FHD Display", "Intel i5-12450H", "16GB RAM", "512GB SSD"],
      score: 8.9,
      rating: 4.2,
      reviews: 3456,
      url: "#",
      isTopPick: true
    },
    {
      id: "2",
      source: "Flipkart",
      name: "Lenovo IdeaPad Slim 3",
      price: "₹49,999",
      originalPrice: "₹54,999",
      specs: ["14″ FHD Display", "AMD Ryzen 5 5500U", "8GB RAM", "512GB SSD"],
      score: 8.5,
      rating: 4.0,
      reviews: 2345,
      url: "#"
    },
    {
      id: "3",
      source: "Croma",
      name: "Dell Inspiron 14",
      price: "₹58,999",
      originalPrice: "₹62,999",
      specs: ["14″ FHD Display", "Intel i5-1235U", "16GB RAM", "512GB SSD"],
      score: 8.3,
      rating: 4.1,
      reviews: 1890,
      url: "#"
    },
    {
      id: "4",
      source: "Amazon",
      name: "Apple MacBook Air M1",
      price: "₹84,900",
      specs: ["13.3″ Retina Display", "Apple M1 Chip", "8GB RAM", "256GB SSD"],
      score: 9.5,
      rating: 4.8,
      reviews: 12000,
      url: "#"
    },
    {
      id: "5",
      source: "Reliance Digital",
      name: "ASUS VivoBook 15",
      price: "₹42,999",
      specs: ["15.6″ FHD Display", "Intel i3-1115G4", "8GB RAM", "512GB SSD"],
      score: 7.9,
      rating: 3.8,
      reviews: 950,
      url: "#"
    }
  ];

  const mockLaptopSummary: SummaryData = {
    recommendation: "The HP Pavilion 15 (2024) offers the best balance of performance and value for most users. For premium experience, consider the Apple MacBook Air M1.",
    keyInsights: [
      "Intel i5 and AMD Ryzen 5 are top picks for mid-range laptops",
      "SSD storage and 8GB+ RAM are now standard",
      "Apple M1 chip delivers unmatched battery life and performance",
      "Look for FHD displays for better clarity"
    ],
    priceRange: {
      min: "₹42,999",
      max: "₹84,900",
      average: "₹60,000"
    },
    topBrands: ["HP", "Lenovo", "Dell", "Apple", "ASUS"],
    considerations: [
      "Check for student discounts and exchange offers",
      "Apple laptops offer longer software support",
      "SSD size impacts speed and storage capacity"
    ]
  };

  const mockEarbuds: ProductResult[] = [
    {
      id: "1",
      source: "Amazon",
      name: "Sony WF-1000XM4",
      price: "₹19,990",
      specs: ["Noise Cancellation", "30hr Battery", "IPX4 Water Resistant"],
      score: 9.3,
      rating: 4.7,
      reviews: 5000,
      url: "#",
      isTopPick: true
    },
    {
      id: "2",
      source: "Flipkart",
      name: "OnePlus Buds Pro 2",
      price: "₹11,999",
      specs: ["ANC", "38hr Battery", "IP55 Water Resistant"],
      score: 8.8,
      rating: 4.5,
      reviews: 3200,
      url: "#"
    },
    {
      id: "3",
      source: "Croma",
      name: "JBL Tune 230NC",
      price: "₹5,999",
      specs: ["ANC", "40hr Battery", "IPX4 Water Resistant"],
      score: 8.1,
      rating: 4.2,
      reviews: 2100,
      url: "#"
    }
  ];

  const mockEarbudsSummary: SummaryData = {
    recommendation: "Sony WF-1000XM4 is the best choice for audiophiles seeking top-tier noise cancellation and battery life.",
    keyInsights: [
      "ANC is now standard in premium earbuds",
      "Battery life ranges from 30-40 hours",
      "Water resistance is a must for workouts"
    ],
    priceRange: {
      min: "₹5,999",
      max: "₹19,990",
      average: "₹12,000"
    },
    topBrands: ["Sony", "OnePlus", "JBL"],
    considerations: [
      "Look for multi-device pairing",
      "Check for fit and comfort",
      "Warranty and service support are important"
    ]
  };

  const mockTVs: ProductResult[] = [
    {
      id: "1",
      source: "Amazon",
  name: "Samsung 55\" 4K Ultra HD Smart LED TV",
      price: "₹49,999",
      specs: ["4K UHD", "Smart TV", "55-inch", "HDR"],
      score: 9.0,
      rating: 4.5,
      reviews: 8000,
      url: "#",
      isTopPick: true
    },
    {
      id: "2",
      source: "Flipkart",
  name: "Sony Bravia 50\" 4K UHD LED Smart TV",
      price: "₹47,999",
      specs: ["4K UHD", "Smart TV", "50-inch", "HDR"],
      score: 8.7,
      rating: 4.4,
      reviews: 6500,
      url: "#"
    }
  ];

  const mockTVSummary: SummaryData = {
    recommendation: "Samsung 55\" 4K UHD Smart TV offers the best value for large-screen entertainment under ₹50k.",
    keyInsights: [
      "4K UHD and HDR are standard in this price range",
      "Smart features include streaming apps and voice control"
    ],
    priceRange: {
      min: "₹47,999",
      max: "₹49,999",
      average: "₹48,999"
    },
    topBrands: ["Samsung", "Sony"],
    considerations: [
      "Check for HDMI ports and connectivity",
      "Wall-mount options and warranty coverage"
    ]
  };

  // Default summary for mobiles
  const mockSummary: SummaryData = {
    recommendation: "Based on our analysis, the Samsung Galaxy A54 5G offers the best value for money under ₹30k with excellent camera quality, reliable performance, and strong brand support. The Super AMOLED display and 50MP camera make it ideal for photography enthusiasts.",
    keyInsights: [
      "Samsung and OnePlus dominate the mid-range segment with superior build quality",
      "AMOLED displays are becoming standard in this price range",
      "5000mAh+ batteries are now common across all brands",
      "Triple camera setups with 50MP+ main sensors are the new standard"
    ],
    priceRange: {
      min: "₹19,999",
      max: "₹28,999",
      average: "₹24,999"
    },
    topBrands: ["Samsung", "OnePlus", "Xiaomi", "Vivo", "Realme"],
    considerations: [
      "Consider buying during festival sales for additional discounts",
      "Check for 5G network availability in your area",
      "Samsung offers longer software support compared to Chinese brands"
    ]
  };


  const simulateSearch = async (query: string) => {
    setIsSearching(true);
    setProgress(0);
    setMessages([]);
    setResults([]);
    setSummary(null);

    // Determine category from query
    const queryLower = query.toLowerCase();
    let results: ProductResult[] = mockMobiles;
    let summary: SummaryData = mockSummary;

    if (queryLower.includes("laptop")) {
      results = mockLaptops;
      summary = mockLaptopSummary;
    } else if (queryLower.includes("earbud") || queryLower.includes("headphone")) {
      results = mockEarbuds;
      summary = mockEarbudsSummary;
    } else if (queryLower.includes("tv")) {
      results = mockTVs;
      summary = mockTVSummary;
    }

    const searchSteps = [
      { message: `Starting search for: "${query}"`, type: 'info' as const, details: 'Initializing AI agent...' },
      { message: 'Analyzing search intent...', type: 'progress' as const, details: 'Understanding product requirements' },
      { message: 'Scraping Amazon product listings', type: 'progress' as const, details: 'Found 1,247 products' },
      { message: 'Scraping Flipkart product listings', type: 'progress' as const, details: 'Found 856 products' },
      { message: 'Analyzing Croma inventory', type: 'progress' as const, details: 'Found 234 products' },
      { message: 'Processing price comparisons', type: 'progress' as const, details: 'Comparing across 15+ platforms' },
      { message: 'Applying AI scoring algorithm', type: 'progress' as const, details: 'Rating products based on specs and reviews' },
      { message: 'Filtering top results', type: 'success' as const, details: 'Selected 5 best matches' },
      { message: 'Generating AI summary', type: 'progress' as const, details: 'Creating personalized recommendations' },
      { message: 'Search completed successfully!', type: 'success' as const, details: 'Ready to display results' }
    ];

    for (let i = 0; i < searchSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      const step = searchSteps[i];
      const newMessage: StreamMessage = {
        id: `msg-${Date.now()}-${i}`,
        type: step.type,
        message: step.message,
        timestamp: new Date(),
        details: step.details
      };

      setMessages(prev => [...prev, newMessage]);
      setProgress(((i + 1) / searchSteps.length) * 100);

      // Show results after processing step
      if (i === 7) {
        setTimeout(() => setResults(results), 500);
      }

      // Show summary after final step
      if (i === searchSteps.length - 1) {
        setTimeout(() => setSummary(summary), 800);
      }
    }

    setIsSearching(false);
    toast({
      title: "Search Complete!",
      description: `Found ${results.length} products matching your criteria`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-12 pb-8">
        <div className="container mx-auto text-center px-6">
          <div className="max-w-6xl mx-auto smooth-enter">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="text-left lg:text-left">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  AI-Powered Product Discovery
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Get instant, intelligent product recommendations with real-time price comparisons across multiple platforms. 
                  Our AI agent does the heavy lifting for you.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    "🔍 Smart Search",
                    "⚡ Real-time Results", 
                    "🎯 AI Recommendations",
                    "💰 Price Comparison"
                  ].map((feature, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="relative z-10">
                  <img 
                    src={heroImage} 
                    alt="BROWSEEASE AI Web Navigation" 
                    className="w-full h-auto rounded-2xl shadow-2xl border border-border/50"
                  />
                </div>
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10 scale-110"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="pb-8">
        <SearchInput onSearch={simulateSearch} isLoading={isSearching} />
      </section>

      {/* Live Stream Section */}
      <section className="pb-8">
        <LiveStream 
          isActive={isSearching} 
          progress={progress} 
          messages={messages}
        />
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="pb-8">
          <ResultsTable results={results} isLoading={false} />
        </section>
      )}

      {/* Summary Section */}
      {summary && (
        <section className="pb-12">
          <SummarySection summary={summary} isLoading={false} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              <span className="font-semibold text-primary">BROWSEEASE</span> - Intelligent Web Navigation Agent
            </p>
            <p className="text-sm">
              Powered by advanced AI for smarter shopping decisions
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
