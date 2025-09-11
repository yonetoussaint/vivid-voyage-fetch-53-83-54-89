import React from 'react';
import { Filter, Star, Truck, DollarSign, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SearchFiltersBarProps {
  onFilterSelect: (filter: string) => void;
  activeFilters: string[];
}

const SearchFiltersBar: React.FC<SearchFiltersBarProps> = ({
  onFilterSelect,
  activeFilters
}) => {
  const filterOptions = [
    { id: 'filters', label: 'Filters', icon: Filter, color: 'text-gray-600' },
    { id: 'free-shipping', label: 'Free shipping', icon: Truck, color: 'text-green-600' },
    { id: 'best-sellers', label: 'Best sellers', icon: Star, color: 'text-yellow-600' },
    { id: 'new-arrivals', label: 'New arrivals', icon: Zap, color: 'text-blue-600' },
    { id: 'under-25', label: 'Under $25', icon: DollarSign, color: 'text-purple-600' },
    { id: 'deals', label: 'Deals', icon: Gift, color: 'text-red-600' },
  ];

  return (
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="px-4 pb-3 bg-white"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {filterOptions.map((filter, index) => {
          const isActive = activeFilters.includes(filter.id);
          const IconComponent = filter.icon;
          
          return (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button 
                variant={isActive ? "default" : "outline"}
                size="sm" 
                className={`rounded-full whitespace-nowrap text-xs h-8 px-3 ${
                  isActive 
                    ? 'bg-red-500 text-white border-red-500 shadow-md' 
                    : 'hover:bg-gray-50 active:scale-95'
                } transition-all duration-200`}
                onClick={() => onFilterSelect(filter.id)}
              >
                <IconComponent className={`h-3 w-3 mr-1.5 ${isActive ? 'text-white' : filter.color}`} />
                {filter.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SearchFiltersBar;