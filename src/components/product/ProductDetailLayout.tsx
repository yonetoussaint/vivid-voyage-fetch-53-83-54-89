import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

import { useProductDetailState } from './useProductDetailState';

// Import sub-components
import ProductHeaderSection from './sections/ProductHeaderSection';
import ProductGallerySection from './sections/ProductGallerySection';
import StickyTabsNavigation from './StickyTabsNavigation';
import ProductContentSections from './sections/ProductContentSections';
import ProductRelatedSection from './sections/ProductRelatedSection';
import ProductScrollManager from './ProductScrollManager';
import ProductVariantManager from './ProductVariantManager';
import ProductStickyComponents from './sections/ProductStickyComponents';

interface ProductDetailLayoutProps {
  product: any;
  productId: string;
}

const ProductDetailLayout: React.FC<ProductDetailLayoutProps> = ({ product, productId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();

  const {
    state,
    refs,
    handlers
  } = useProductDetailState(product);

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

    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overscroll-none" ref={refs.contentRef}>
      {/* Header Section */}
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
        onSellerClick={() => navigate(`/seller/${product?.sellers?.id}`)}
      />

      {/* Sticky Tabs Navigation - Moved back to main layout */}
      <StickyTabsNavigation
        headerHeight={state.headerHeight}
        galleryRef={refs.galleryRef}
      />

      {/* Main Content Sections */}
      <ProductContentSections
        productId={productId}
        product={product}
        descriptionRef={refs.descriptionRef}
        productDetailsSheetOpen={state.productDetailsSheetOpen}
        setProductDetailsSheetOpen={state.setProductDetailsSheetOpen}
      />

      {/* Related Products Section */}
      <ProductRelatedSection />

      {/* Scroll Management */}
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

      {/* Variant Management */}
      <ProductVariantManager
        product={product}
        displayImages={state.displayImages}
        setDisplayImages={state.setDisplayImages}
        setCurrentImageIndex={state.setCurrentImageIndex}
      />

      {/* Sticky Components */}
      <ProductStickyComponents
        product={product}
        onBuyNow={buyNow}
        sharePanelOpen={state.sharePanelOpen}
        setSharePanelOpen={state.setSharePanelOpen}
      />
    </div>
  );
};

export default ProductDetailLayout;