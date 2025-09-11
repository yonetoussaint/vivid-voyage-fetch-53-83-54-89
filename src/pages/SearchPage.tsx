
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScanLine, Grid, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductHeader from '@/components/product/ProductHeader';

import SpaceSavingCategories from '@/components/home/SpaceSavingCategories';
import SearchRecent from '@/components/search/SearchRecent';
import PopularSearches from '@/components/home/PopularSearches';
import SearchPopular from '@/components/search/SearchPopular';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import VoiceSearchOverlay from '@/components/search/VoiceSearchOverlay';
import SearchPageSkeleton from '@/components/search/SearchPageSkeleton';
import RecentlyViewed from '@/components/home/RecentlyViewed';

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [filtersHeight, setFiltersHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 15 Pro Max',
    'Wireless headphones',
    'Gaming laptop',
    'Smart watch',
    'Bluetooth speaker'
  ]);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calculate header heights
  useEffect(() => {
    const updateHeights = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      if (filtersRef.current) {
        setFiltersHeight(filtersRef.current.offsetHeight);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newSearch = query.trim();
      setRecentSearches(prev => [
        newSearch,
        ...prev.filter(s => s !== newSearch)
      ].slice(0, 5));
      
      navigate(`/search?q=${encodeURIComponent(newSearch)}`);
      
      toast({
        title: "Searching...",
        description: `Looking for "${newSearch}"`,
      });
    }
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(true);
    // Simulate voice search
    setTimeout(() => {
      setIsVoiceActive(false);
      // You can integrate real speech recognition here
    }, 3000);
  };

  const handleFilterSelect = (filterId: string) => {
    if (filterId === 'filters') {
      // Open advanced filters modal
      toast({
        title: "Filters",
        description: "Advanced filters panel would open here",
      });
      return;
    }

    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const handleCategorySelect = (category: string) => {
    handleSearch(category);
  };

  const handleRecentSearchSelect = (search: string) => {
    handleSearch(search);
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    toast({
      title: "Cleared",
      description: "All recent searches cleared",
    });
  };


  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleProductLike = (productId: string) => {
    toast({
      title: "Added to favorites",
      description: "Product saved to your wishlist",
    });
  };

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to cart",
      description: "Product added to your shopping cart",
    });
  };

  const handleScanClick = () => {
    toast({
      title: "Scan",
      description: "Barcode scanner would open here",
    });
  };

  const searchActionButtons = [
    {
      Icon: ScanLine,
      onClick: handleScanClick
    }
  ];

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div ref={headerRef}>
        <ProductHeader forceScrolledState={true} actionButtons={searchActionButtons} />
      </div>
      

      {/* Content */}
      <SpaceSavingCategories 
        onCategorySelect={handleCategorySelect}
        showHeader={true}
        headerTitle="Shop by Category"
        headerSubtitle="Browse popular categories"
        headerIcon={Grid}
        headerViewAllLink="/categories"
        headerViewAllText="View All"
        headerTitleTransform="uppercase"
      />
      
      <RecentlyViewed 
        showHeader={true}
        headerTitle="Recently Viewed"
        headerIcon={Clock}
        headerViewAllLink="/recently-viewed"
        headerViewAllText="View All"
        headerTitleTransform="uppercase"
        showClearButton={true}
        clearButtonText="× Clear"
        onClearClick={() => toast({ title: "Cleared", description: "Recently viewed items cleared" })}
      />
      
      <SearchRecent
        searches={recentSearches}
        onSearchSelect={handleRecentSearchSelect}
        onRemoveSearch={handleRemoveRecentSearch}
        onClearAll={handleClearAllRecent}
        headerTitleTransform="uppercase"
      />
      
      <PopularSearches />
      
      <BookGenreFlashDeals />

      <VoiceSearchOverlay
        isActive={isVoiceActive}
        onClose={() => setIsVoiceActive(false)}
      />
    </div>
  );
};

export default SearchPage;