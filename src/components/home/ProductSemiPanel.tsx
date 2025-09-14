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

  // Calculate maxScroll based on the container's height
  const maxScroll = scrollContainerRef.current ? scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight : 100;
  const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

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
  const { setHasActiveOverlay } = useScreenOverlay();

  // Get scroll progress for the panel
  const { progress: scrollProgress } = usePanelScrollProgress(scrollContainerRef);

  // Handle panel state changes to control bottom nav visibility
  useEffect(() => {
    setHasActiveOverlay(isOpen);
    return () => {
      setHasActiveOverlay(false);
    };
  }, [isOpen, setHasActiveOverlay]);

  // Log scroll progress for debugging
  useEffect(() => {
    console.log('Scroll progress:', scrollProgress);
  }, [scrollProgress]);

  if (!isOpen) return null;

  const handleTabChange = (section: string) => {
    setActiveSection(section);
    console.log('Tab changed to:', section);
  };

  const handleShareClick = () => {
    console.log('Share clicked in panel');
  };

  const handleProductDetailsClick = () => {
    console.log('Product details clicked');
    onClose();
  };

  return (
    <>
      {/* Backdrop with full coverage */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />

      {/* Semi Panel with reduced height */}
      <div className="fixed bottom-0 left-0 right-0 h-[70vh] bg-white z-[9999] rounded-t-lg shadow-xl overflow-hidden flex flex-col">

        {/* Product Header - with scroll-based behavior */}
        <div 
          ref={headerRef} 
          className="absolute top-0 left-0 right-0 z-50"
        >
          <ProductHeader 
            inPanel={true}
            activeSection={activeSection}
            onTabChange={handleTabChange}
            focusMode={focusMode}
            showHeaderInFocus={showHeaderInFocus}
            onProductDetailsClick={handleProductDetailsClick}
            currentImageIndex={currentImageIndex}
            totalImages={totalImages}
            onShareClick={handleShareClick}
            forceScrolledState={scrollProgress > 0.1} // Show scrolled state when progress > 10%
            customScrollProgress={scrollProgress}
            showCloseIcon={true}
            onCloseClick={onClose}
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
          <div className="flex-1 overflow-hidden min-h-0 relative pt-16"> {/* Added padding to account for header */}
            {/* Scrollable container that we track for scroll progress */}
            <div 
              ref={scrollContainerRef}
              className="absolute inset-0 overflow-y-auto"
              style={{ top: '4rem' }} /* Adjust based on header height */
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