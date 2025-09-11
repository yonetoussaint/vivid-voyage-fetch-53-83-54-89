import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

import ProductHeader from "@/components/product/ProductHeader";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductSectionWrapper from "@/components/product/ProductSectionWrapper";
import ProductDetailsTabs from '@/components/product/ProductDetailsTabs';
import SocialSharePanel from "@/components/product/SocialSharePanel";
import ProductRecommendationsWithTabs from '@/components/product/ProductRecommendationsWithTabs';
import ReviewGallery from '@/components/product/ReviewGallery';
import SearchInfoComponent from '@/components/product/SearchInfoComponent';
import DynamicDescription from '@/components/product/DynamicDescription';
import BookGenreFlashDeals from "@/components/home/BookGenreFlashDeals";
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import StickyTabsNavigation from './StickyTabsNavigation';
import ProductVariantManager from './ProductVariantManager';
import ProductScrollManager from './ProductScrollManager';

import { useProductDetailState } from './useProductDetailState';

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
      <div ref={refs.headerRef} className="relative z-50">
        <ProductHeader 
          activeSection={state.activeSection}
          onTabChange={handlers.scrollToSection}
          focusMode={state.focusMode}
          showHeaderInFocus={state.showHeaderInFocus}
          onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
          currentImageIndex={state.currentImageIndex}
          totalImages={state.totalImages}
          onShareClick={() => state.setSharePanelOpen(true)}
        />
      </div>

      {/* Image Gallery Section */}
      <div className="relative z-0 w-full bg-transparent" ref={refs.overviewRef} onClick={() => { if (state.focusMode) state.setFocusMode(false); }}>
        <ProductImageGallery 
          ref={refs.galleryRef}
          images={state.displayImages.length > 0 ? state.displayImages : ["/placeholder.svg"]}
          videos={product?.product_videos || []}
          model3dUrl={product?.model_3d_url}
          focusMode={state.focusMode}
          onFocusModeChange={state.setFocusMode}
          seller={product?.sellers}
          product={product}
          onSellerClick={() => navigate(`/seller/${product?.sellers?.id}`)}
          onProductDetailsClick={() => state.setProductDetailsSheetOpen(true)}
          onImageIndexChange={(currentIndex, totalItems) => {
            state.setCurrentImageIndex(currentIndex);
            state.setTotalImages(totalItems);
          }}
          onVariantImageChange={handlers.handleVariantImageSelection}
        />
      </div>

      {/* Sticky Tabs Navigation */}
      <StickyTabsNavigation
        headerHeight={state.headerHeight}
        galleryRef={refs.galleryRef}
      />

      {/* Main Content */}
      <div className="flex-1 overscroll-none pb-[112px]">
        <div className="bg-white pb-20">
          {/* Product Details Tabs */}
          <div ref={refs.descriptionRef}>
            <ProductSectionWrapper>
              <ProductDetailsTabs 
                isSheetOpen={state.productDetailsSheetOpen}
                onSheetOpenChange={state.setProductDetailsSheetOpen}
              />
            </ProductSectionWrapper>
          </div>

          {/* Search Info */}
          <ProductSectionWrapper>
            <SearchInfoComponent productId={productId} />
          </ProductSectionWrapper>

          {/* Recommendations */}
          <ProductSectionWrapper>
            <ProductRecommendationsWithTabs/>
          </ProductSectionWrapper>

          {/* Reviews */}
          <ProductSectionWrapper>
            <ReviewGallery />
          </ProductSectionWrapper>

          {/* Description */}
          <ProductSectionWrapper>
            <div className="w-full space-y-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="w-full">
                {product?.description ? (
                  <DynamicDescription 
                    content={product.description} 
                    product={product}
                    className="w-full text-gray-600 leading-relaxed mb-4"
                  />
                ) : (
                  <p className="w-full text-gray-600 leading-relaxed mb-4">
                    Experience premium quality with {product?.name || 'this product'}.
                  </p>
                )}
              </div>
            </div>
          </ProductSectionWrapper>

          {/* Related Products */}
          <div className="w-full">
            <BookGenreFlashDeals 
              excludeTypes={['books']}
              title="RELATED PRODUCTS"
              headerGradient="from-orange-500 via-red-500 to-pink-600"
              categories={[
                { id: 'electronics', label: 'Electronics' },
                { id: 'fashion', label: 'Fashion' },
                { id: 'home', label: 'Home' },
                { id: 'sports', label: 'Sports' },
                { id: 'automotive', label: 'Auto' },
                { id: 'health', label: 'Health' },
                { id: 'beauty', label: 'Beauty' },
                { id: 'toys', label: 'Toys' },
                { id: 'office', label: 'Office' },
                { id: 'garden', label: 'Garden' },
                { id: 'pet', label: 'Pet' }
              ]}
              viewAllLink="/search"
              viewAllText="View All Products"
            />
          </div>
        </div>
      </div>

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

      {/* Sticky Checkout Bar */}
      <StickyCheckoutBar 
        product={product}
        onBuyNow={buyNow}
        selectedColor=""
        selectedStorage=""
        selectedNetwork=""
        selectedCondition=""
        className=""
      />

      <SocialSharePanel 
        open={state.sharePanelOpen}
        onOpenChange={state.setSharePanelOpen}
        product={product}
      />
    </div>
  );
};

export default ProductDetailLayout;