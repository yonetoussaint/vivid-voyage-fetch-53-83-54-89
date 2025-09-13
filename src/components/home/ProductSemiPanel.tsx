import React, { useRef, useState, useEffect } from 'react';
import ProductDetail from '@/pages/ProductDetail';
import ProductHeader from '@/components/product/ProductHeader';
import { Heart, Share } from 'lucide-react';

// Custom hook for panel scroll progress
const usePanelScrollProgress = (scrollContainerRef: React.RefObject<HTMLDivElement>) => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const onScroll = () => {
      setScrollY(container.scrollTop);
    };
    
    onScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef]);
  
  const maxScroll = 120;
  const progress = Math.min(scrollY / maxScroll, 1);
  
  return { scrollY, progress };
};

interface ProductSemiPanelProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSemiPanel: React.FC<ProductSemiPanelProps> = ({
  productId,
  isOpen,
  onClose,
}) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  
  // Get scroll progress for the panel
  const { progress: scrollProgress } = usePanelScrollProgress(scrollContainerRef);

  if (!isOpen) return null;

  const handleTabChange = (section: string) => {
    setActiveSection(section);
    console.log('Tab changed to:', section);
    // You might want to implement scroll-to-section logic here
  };

  const handleShareClick = () => {
    console.log('Share clicked in panel');
  };

  const handleProductDetailsClick = () => {
    console.log('Product details clicked');
    onClose(); // Or any other action
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Semi Panel */}
      <div className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white z-50 rounded-t-lg shadow-xl overflow-hidden flex flex-col">
        {/* Panel Header with custom close button */}
        <div className="relative flex items-center justify-center py-3 border-b border-gray-200">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          <button 
            onClick={onClose}
            className="absolute right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Header - with scroll-based behavior */}
        <div 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${scrollProgress * 0.95})`,
            backdropFilter: `blur(${scrollProgress * 8}px)`,
          }}
        >
          <ProductHeader 
            inPanel={false} // Use fixed positioning behavior
            activeSection={activeSection}
            onTabChange={handleTabChange}
            focusMode={focusMode}
            showHeaderInFocus={showHeaderInFocus}
            onProductDetailsClick={handleProductDetailsClick}
            currentImageIndex={currentImageIndex}
            totalImages={totalImages}
            onShareClick={handleShareClick}
            forceScrolledState={false} // Let it use actual scroll progress
            customScrollProgress={scrollProgress} // Pass custom scroll progress
            actionButtons={[
              {
                Icon: Heart,
                active: false,
                onClick: () => console.log('Favorite clicked in panel'),
                count: 147
              },
              {
                Icon: Share,
                onClick: handleShareClick,
                count: 23
              }
            ]}
          />
        </div>

        {/* Scrollable Content with header space */}
        {productId ? (
          <div className="flex-1 overflow-hidden min-h-0 relative">
            {/* Scrollable container that we track for scroll progress */}
            <div 
              ref={scrollContainerRef}
              className="absolute inset-0 overflow-y-auto pt-16"
            >
              <ProductDetail productId={productId} hideHeader={true} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              No product selected
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductSemiPanel;