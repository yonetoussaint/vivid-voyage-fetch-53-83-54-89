import React from "react";
import ProductSectionWrapper from "@/components/product/ProductSectionWrapper";
import ProductDetailsTabs from '@/components/product/ProductDetailsTabs';
import SearchInfoComponent from '@/components/product/SearchInfoComponent';
import ProductRecommendationsWithTabs from '@/components/product/ProductRecommendationsWithTabs';
import ReviewGallery from '@/components/product/ReviewGallery';
import DynamicDescription from '@/components/product/DynamicDescription';

interface ProductContentSectionsProps {
  productId: string;
  product: any;
  descriptionRef: React.RefObject<HTMLDivElement>;
  productDetailsSheetOpen: boolean;
  setProductDetailsSheetOpen: (open: boolean) => void;
}

const ProductContentSections: React.FC<ProductContentSectionsProps> = ({
  productId,
  product,
  descriptionRef,
  productDetailsSheetOpen,
  setProductDetailsSheetOpen
}) => {
  return (
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
      </div>
    </div>
  );
};

export default ProductContentSections;