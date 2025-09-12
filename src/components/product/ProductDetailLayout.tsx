import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

import { useProductDetailState } from './useProductDetailState';

// Import sub-components
import ProductHeaderSection from './ProductHeaderSection';
import ProductGallerySection from './ProductGallerySection';
import StickyTabsNavigation from './StickyTabsNavigation';
import ProductContentSections from './ProductContentSections';
import ProductRelatedSection from './ProductRelatedSection';
import ProductScrollManager from './ProductScrollManager';
import ProductVariantManager from './ProductVariantManager';
import ProductStickyComponents from './ProductStickyComponents';

interface ProductDetailLayoutProps {
  product: any;
  productId: string;
  isEmbedded?: boolean; // Add this prop to detect iframe embedding
}

const ProductDetailLayout: React.FC<ProductDetailLayoutProps> = ({ 
  product, 
  productId,
  isEmbedded = false 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const {
    state,
    refs,
    handlers
  } = useProductDetailState(product);

  // Notify parent window about our height when in embedded mode
  useEffect(() => {
    if (isEmbedded) {
      const sendHeightToParent = () => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({
          type: 'IFRAME_HEIGHT',
          height: height
        }, '*');
      };

      // Send height initially
      sendHeightToParent();

      // Set up a mutation observer to detect DOM changes
      const observer = new MutationObserver(sendHeightToParent);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        characterData: true
      });

      // Also send on resize
      window.addEventListener('resize', sendHeightToParent);

      return () => {
        observer.disconnect();
        window.removeEventListener('resize', sendHeightToParent);
      };
    }
  }, [isEmbedded]);

  // Buy now function
  const buyNow = async () => {
    if (!user) {
      openAuthOverlay();
      return;
    }

    const currentPrice = product?.discount_price || product?.price || 0;
    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: "1",
      price: currentPrice.toString(),
    });

    // Handle navigation differently in embedded mode
    if (isEmbedded) {
      window.parent.postMessage({
        type: 'NAVIGATE',
        url: `/product-checkout?${checkoutParams.toString()}`
      }, '*');
    } else {
      navigate(`/product-checkout?${checkoutParams.toString()}`);
    }
  };

  return (
    <div className={`flex flex-col min-h-0 overscroll-none ${isEmbedded ? 'bg-white embedded-mode' : 'bg-white'}`} 
         ref={refs.contentRef}>
      
      {/* Header Section - Conditionally render based on embedded mode */}
      {!isEmbedded && (
        <ProductHeaderSection
          ref={refs.headerRef}
          activeSection={state.activeSection}
          onTabChange={handlers.scrollToSection}
          focusMode={state.focusMode}
          showHeaderInFocus={state.showHeaderInFocus}
          onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
          currentImageIndex={state.currentImageIndex}
          totalImages={state.totalImages}
          onShareClick={() => state.setSharePanelOpen(true)}
        />
      )}

      {/* Image Gallery Section */}
      <ProductGallerySection
        ref={refs.overviewRef}
        galleryRef={refs.galleryRef}
        displayImages={state.displayImages}
        product={product}
        focusMode={state.focusMode}
        onFocusModeChange={state.setFocusMode}
        onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
        onImageIndexChange={(currentIndex, totalItems) => {
          state.setCurrentImageIndex(currentIndex);
          state.setTotalImages(totalItems);
        }}
        onVariantImageChange={handlers.handleVariantImageSelection}
        onSellerClick={() => {
          if (isEmbedded) {
            window.parent.postMessage({
              type: 'NAVIGATE',
              url: `/seller/${product?.sellers?.id}`
            }, '*');
          } else {
            navigate(`/seller/${product?.sellers?.id}`);
          }
        }}
        isEmbedded={isEmbedded}
      />

      {/* Sticky Tabs Navigation - Conditionally render based on embedded mode */}
      {!isEmbedded && (
        <StickyTabsNavigation
          headerHeight={state.headerHeight}
          galleryRef={refs.galleryRef}
        />
      )}

      {/* Main Content Sections */}
      <ProductContentSections
        productId={productId}
        product={product}
        descriptionRef={refs.descriptionRef}
        productDetailsSheetOpen={state.productDetailsSheetOpen}
        setProductDetailsSheetOpen={state.setProductDetailsSheetOpen}
        isEmbedded={isEmbedded}
      />

      {/* Related Products Section */}
      <ProductRelatedSection isEmbedded={isEmbedded} />

      {/* Scroll Management - Only needed in non-embedded mode */}
      {!isEmbedded && (
        <ProductScrollManager
          focusMode={state.focusMode}
          setFocusMode={state.setFocusMode}
          setShowHeaderInFocus={state.setShowHeaderInFocus}
          setShowStickyRecommendations={state.setShowStickyRecommendations}
          setActiveSection={state.setActiveSection}
          setActiveTab={state.setActiveTab}
          headerRef={refs.headerRef}
          setHeaderHeight={state.setHeaderHeight}
          overviewRef={refs.overviewRef}
          descriptionRef={refs.descriptionRef}
          verticalRecommendationsRef={refs.verticalRecommendationsRef}
        />
      )}

      {/* Variant Management */}
      <ProductVariantManager
        product={product}
        displayImages={state.displayImages}
        setDisplayImages={state.setDisplayImages}
        setCurrentImageIndex={state.setCurrentImageIndex}
      />

      {/* Sticky Components - Conditionally render based on embedded mode */}
      {!isEmbedded && (
        <ProductStickyComponents
          product={product}
          onBuyNow={buyNow}
          sharePanelOpen={state.sharePanelOpen}
          setSharePanelOpen={state.setSharePanelOpen}
        />
      )}

      {/* Add a simplified sticky header for embedded mode */}
      {isEmbedded && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <h2 className="text-lg font-semibold truncate">{product?.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">
              ${product?.discount_price || product?.price}
            </span>
            {product?.discount_price && (
              <span className="text-sm text-gray-500 line-through">
                ${product?.price}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailLayout;