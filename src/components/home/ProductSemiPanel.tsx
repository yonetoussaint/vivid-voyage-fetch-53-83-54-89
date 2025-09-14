import React, { useRef, useState, useEffect } from 'react';
import ProductDetail from '@/pages/ProductDetail';
import ProductHeader from '@/components/product/ProductHeader';
import { Heart, Share } from 'lucide-react';
import { useScreenOverlay } from "@/context/ScreenOverlayContext";

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

// Custom hook for panel scroll behavior management (similar to ProductScrollManager)
const usePanelScrollBehavior = (
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  scrollY: number
) => {
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  
  useEffect(() => {
    // Handle focus mode based on scroll position
    if (focusMode && scrollY > 100) {
      setFocusMode(false);
    }
    if (focusMode && scrollY <= 50) {
      setShowHeaderInFocus(false);
    }
    
    // Handle section detection based on scroll position
    if (scrollY > 200) {
      setActiveSection("description");
    } else {
      setActiveSection("overview");
    }
  }, [scrollY, focusMode]);
  
  return {
    focusMode,
    setFocusMode,
    showHeaderInFocus,
    setShowHeaderInFocus,
    activeSection,
    setActiveSection
  };
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const { setHasActiveOverlay } = useScreenOverlay();
  
  // Get scroll progress for the panel
  const { scrollY, progress: scrollProgress } = usePanelScrollProgress(scrollContainerRef);
  
  // Get scroll behavior state management
  const {
    focusMode,
    setFocusMode,
    showHeaderInFocus,
    setShowHeaderInFocus,
    activeSection,
    setActiveSection
  } = usePanelScrollBehavior(scrollContainerRef, scrollY);

  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

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
      {/* Backdrop with full coverage */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />

      {/* Semi Panel with very high z-index */}
      <div className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white z-[9999] rounded-t-lg shadow-xl overflow-hidden flex flex-col">

        {/* Product Header - with scroll-based behavior */}
        <div 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 z-50"
        >
          <ProductHeader 
            inPanel={false} // Use false to enable proper scroll behavior like ProductDetail
            activeSection={activeSection}
            onTabChange={handleTabChange}
            focusMode={focusMode}
            showHeaderInFocus={showHeaderInFocus}
            onProductDetailsClick={handleProductDetailsClick}
            currentImageIndex={currentImageIndex}
            totalImages={totalImages}
            onShareClick={handleShareClick}
            forceScrolledState={false}
            customScrollProgress={scrollProgress} // Still pass the custom scroll progress
            showCloseIcon={true} // Show X icon in panel
            onCloseClick={onClose} // Handle close click
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
              className="absolute inset-0 overflow-y-auto"
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