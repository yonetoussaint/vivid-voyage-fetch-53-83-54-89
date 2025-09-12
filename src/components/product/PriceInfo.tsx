import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies, currencyToCountry } from '@/contexts/CurrencyContext';

interface CurrencySwitcherProps {
  showPrice?: boolean;
  price?: number;
  className?: string;
  buttonClassName?: string;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({ 
  showPrice = true, 
  price = 0,
  className = "",
  buttonClassName = ""
}) => {
  const { currentCurrency, toggleCurrency, formatPrice } = useCurrency();

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css" />

      <div className={className}>
        <button
          onClick={toggleCurrency}
          className={`bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 hover:bg-black/70 transition-colors ${buttonClassName}`}
          aria-label="Change currency"
        >
          <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center">
            <span className={`fi fi-${currencyToCountry[currentCurrency]} scale-150`}></span>
          </div>
          <ChevronDown className="w-3 h-3 stroke-2" />
          {showPrice && (
            <span className="text-white font-bold">
              {formatPrice(price)}
            </span>
          )}
          <span className="font-bold">
            {currencies[currentCurrency]}
          </span>
        </button>
      </div>
    </>
  );
};

interface PriceInfoProps {
  product?: {
    id: string;
    name: string;
    price: number;
    discount_price?: number | null;
  };
  bundlePrice?: number;
  focusMode?: boolean;
  isPlaying?: boolean;
  configurationData?: {
    selectedColor?: string;
    selectedStorage?: string;
    selectedNetwork?: string;
    selectedCondition?: string;
    getSelectedColorVariant: () => any;
    getSelectedStorageVariant: () => any;
    getSelectedNetworkVariant: () => any;
    getSelectedConditionVariant: () => any;
    formatPrice: (price: number) => string;
  } | null;
}

const PriceInfo: React.FC<PriceInfoProps> = ({ 
  product, 
  bundlePrice, 
  focusMode,
  isPlaying,
  configurationData 
}) => {
  const { formatPrice } = useCurrency();

  if (!product) return null;

  // Memoize the price calculation to prevent unnecessary re-renders
  const currentPrice = React.useMemo(() => {
    if (configurationData) {
      // Get the actual selected variant price from the deepest level
      const selectedConditionVariant = configurationData.getSelectedConditionVariant();
      if (selectedConditionVariant) {
        return selectedConditionVariant.price;
      }

      const selectedNetworkVariant = configurationData.getSelectedNetworkVariant();
      if (selectedNetworkVariant) {
        return selectedNetworkVariant.price;
      }

      const selectedStorageVariant = configurationData.getSelectedStorageVariant();
      if (selectedStorageVariant) {
        return selectedStorageVariant.price;
      }

      const selectedColorVariant = configurationData.getSelectedColorVariant();
      if (selectedColorVariant) {
        return selectedColorVariant.price;
      }
    }

    // Fallback to product price
    return product.discount_price || product.price;
  }, [product, configurationData]);

  return (
    <div className={`absolute bottom-12 left-3 z-30 transition-opacity duration-300 ${(focusMode || isPlaying) ? 'opacity-0' : ''}`}>
      <CurrencySwitcher 
        showPrice={true}
        price={currentPrice}
      />
    </div>
  );
};

export default PriceInfo;