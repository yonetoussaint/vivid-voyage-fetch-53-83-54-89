import React from "react";
import { useNavigate } from "react-router-dom";
import ProductImageGallery from "@/components/ProductImageGallery";
import StickyTabsNavigation from './StickyTabsNavigation';

interface ProductGallerySectionProps {
  ref: React.RefObject<HTMLDivElement>;
  galleryRef: React.RefObject<HTMLDivElement>;
  displayImages: string[];
  product: any;
  focusMode: boolean;
  onFocusModeChange: (focus: boolean) => void;
  onProductDetailsClick: () => void;
  onImageIndexChange: (currentIndex: number, totalItems: number) => void;
  onVariantImageChange: (imageUrl: string) => void;
  onSellerClick: () => void;
}

const ProductGallerySection: React.FC<ProductGallerySectionProps> = React.forwardRef(({
  galleryRef,
  displayImages,
  product,
  focusMode,
  onFocusModeChange,
  onProductDetailsClick,
  onImageIndexChange,
  onVariantImageChange,
  onSellerClick
}, ref) => {
  return (
    <div className="relative z-0 w-full bg-transparent" ref={ref} onClick={() => { if (focusMode) onFocusModeChange(false); }}>
      <ProductImageGallery 
        ref={galleryRef}
        images={displayImages.length > 0 ? displayImages : ["/placeholder.svg"]}
        videos={product?.product_videos || []}
        model3dUrl={product?.model_3d_url}
        focusMode={focusMode}
        onFocusModeChange={onFocusModeChange}
        seller={product?.sellers}
        product={product}
        onSellerClick={onSellerClick}
        onProductDetailsClick={onProductDetailsClick}
        onImageIndexChange={onImageIndexChange}
        onVariantImageChange={onVariantImageChange}
      />
      
      <StickyTabsNavigation
        galleryRef={galleryRef}
      />
    </div>
  );
});

ProductGallerySection.displayName = "ProductGallerySection";

export default ProductGallerySection;