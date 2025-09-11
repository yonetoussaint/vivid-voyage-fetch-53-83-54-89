// Updated ProductDetail component with proper ref handling
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from '@/context/RedirectAuthContext';
import { useAuthOverlay } from '@/context/AuthOverlayContext';

// Import sub-components
import ProductHeader from "@/components/product/ProductHeader";
import ProductImageGallery, { ProductImageGalleryRef } from "@/components/ProductImageGallery";
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

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

const ProductDetail = () => {
  console.log('🚀 ProductDetail component loaded');

  // State management
  const [activeSection, setActiveSection] = useState("overview");
  const [activeTab, setActiveTab] = useState("overview");
  const [focusMode, setFocusMode] = useState(false);
  const [showHeaderInFocus, setShowHeaderInFocus] = useState(false);
  const [productDetailsSheetOpen, setProductDetailsSheetOpen] = useState(false);
  const [showStickyRecommendations, setShowStickyRecommendations] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [headerHeight, setHeaderHeight] = useState(44);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const imageGalleryRef = useRef<ProductImageGalleryRef>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const verticalRecommendationsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<ProductImageGalleryRef>(null);
  const focusModeRef = useRef(focusMode);
  const prevFocusModeRef = useRef(focusMode);

  // Hooks
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openAuthOverlay } = useAuthOverlay();
  const { id: paramId } = useParams<{ id: string }>();
  const productId = paramId || DEFAULT_PRODUCT_ID;

  const { data: product, isLoading } = useProduct(productId);

  // Keep track of current focusMode in a ref for stable event handlers
  useEffect(() => {
    focusModeRef.current = focusMode;
  }, [focusMode]);

  // Push a history state entry when entering focus mode
  useEffect(() => {
    if (!prevFocusModeRef.current && focusMode) {
      try {
        history.pushState({ focusOverlay: true }, '');
      } catch {}
    }
    prevFocusModeRef.current = focusMode;
  }, [focusMode]);

  // Global back-button handler: if in focus mode, exit it
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (focusModeRef.current) {
        setFocusMode(false);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [setFocusMode]);

  // Function to handle tab changes - this should sync with the gallery's tab state
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    // If we have access to the gallery, update its tab state too
    if (imageGalleryRef.current && imageGalleryRef.current.setActiveTab) {
      imageGalleryRef.current.setActiveTab(tab);
    }
  }, []);

  // Handle variant image selection
  const handleVariantImageSelection = useCallback((imageUrl: string, variantName: string) => {
    console.log('📷 Variant image selected in ProductDetail:', imageUrl, variantName);

    // Update display images with variant image first
    const otherImages = product?.product_images?.map((img: any) => img.src).filter(img => img !== imageUrl) || [];
    const newImages = [imageUrl, ...otherImages];
    setDisplayImages(newImages);
    setCurrentImageIndex(0);
  }, [product]);

  // Initialize display images and handle default variant image
  useEffect(() => {
    const imgs = product?.product_images?.map((img: any) => img.src) || [];
    if (imgs.length > 0) {
      setDisplayImages(imgs);
    }
  }, [product?.product_images]);

  // Scroll to section function
  const scrollToSection = (section: string) => {
    const refs = {
      overview: overviewRef,
      description: descriptionRef
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const yOffset = -120;
      const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveSection(section);
  };

  // Buy now function
  const buyNow = async () => {
    if (!user) {
      openAuthOverlay();
      return;
    }

    // Calculate current price (simplified for now)
    const currentPrice = product?.discount_price || product?.price || 0;

    const checkoutParams = new URLSearchParams({
      productName: product?.name || "Product",
      quantity: "1",
      price: currentPrice.toString(),
    });

    navigate(`/product-checkout?${checkoutParams.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overscroll-none" ref={contentRef}>
      {/* Header Section */}
      <div ref={headerRef} className="relative z-50">
        <ProductHeader 
          activeSection={activeSection}
          onTabChange={scrollToSection}
          focusMode={focusMode}
          showHeaderInFocus={showHeaderInFocus}
          onProductDetailsClick={() => setProductDetailsSheetOpen(true)}
          currentImageIndex={currentImageIndex}
          totalImages={totalImages}
          onShareClick={() => setSharePanelOpen(true)}
        />
      </div>

      {/* Image Gallery Section */}
      <div className="relative z-0 w-full bg-transparent" ref={overviewRef} onClick={() => { if (focusMode) setFocusMode(false); }}>
        <ProductImageGallery 
          ref={galleryRef}
          images={displayImages.length > 0 ? displayImages : ["/placeholder.svg"]}
          videos={product?.product_videos || []}
          model3dUrl={product?.model_3d_url}
          focusMode={focusMode}
          onFocusModeChange={setFocusMode}
          seller={product?.sellers}
          product={product}
          onSellerClick={() => navigate(`/seller/${product?.sellers?.id}`)}
          onProductDetailsClick={() => setProductDetailsSheetOpen(true)}
          onImageIndexChange={(currentIndex, totalItems) => {
            setCurrentImageIndex(currentIndex);
            setTotalImages(totalItems);
          }}
          onVariantImageChange={handleVariantImageSelection}
        />
      </div>

      {/* Sticky Tabs Navigation - Always render, let it handle its own visibility */}
      <StickyTabsNavigation
        headerHeight={headerHeight}
        galleryRef={galleryRef}
      />

      {/* Main Content */}
      <div className="flex-1 overscroll-none pb-[112px]">
        <div className="bg-white pb-20">
          {/* Product Details Tabs */}
          <div ref={descriptionRef}>
            <ProductSectionWrapper>
              <ProductDetailsTabs 
                isSheetOpen={productDetailsSheetOpen}
                onSheetOpenChange={setProductDetailsSheetOpen}
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
        focusMode={focusMode}
        setFocusMode={setFocusMode}
        setShowHeaderInFocus={setShowHeaderInFocus}
        setShowStickyRecommendations={setShowStickyRecommendations}
        setActiveSection={setActiveSection}
        setActiveTab={setActiveTab}
        headerRef={headerRef}
        setHeaderHeight={setHeaderHeight}
        overviewRef={overviewRef}
        descriptionRef={descriptionRef}
        verticalRecommendationsRef={verticalRecommendationsRef}
      />

      {/* Variant Management */}
      <ProductVariantManager
        product={product}
        displayImages={displayImages}
        setDisplayImages={setDisplayImages}
        setCurrentImageIndex={setCurrentImageIndex}
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
        open={sharePanelOpen}
        onOpenChange={setSharePanelOpen}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;