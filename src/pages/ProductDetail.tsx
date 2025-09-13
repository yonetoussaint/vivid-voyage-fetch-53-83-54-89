import React from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import ProductDetailLayout from "@/components/product/ProductDetailLayout";
import ProductDetailLoading from "@/components/product/ProductDetailLoading";
import ProductDetailError from "@/components/product/ProductDetailError";

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

interface ProductDetailProps {
  productId?: string; // Make it optional so it can work with router params too
  hideHeader?: boolean; // New prop to hide header when used in panels
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId: propProductId, hideHeader = false }) => {
  console.log('🚀 ProductDetail component loaded');

  const { id: paramId } = useParams<{ id: string }>();
  // Use prop productId if provided, otherwise use router param, otherwise default
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;
  
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (!product) {
    return <ProductDetailError />;
  }

  return <ProductDetailLayout product={product} productId={productId} hideHeader={hideHeader} />;
};

export default ProductDetail;