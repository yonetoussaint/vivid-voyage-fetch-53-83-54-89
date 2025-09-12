import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import ProductDetailLayout from "@/components/product/ProductDetailLayout";
import ProductDetailLoading from "@/components/product/ProductDetailLoading";
import ProductDetailError from "@/components/product/ProductDetailError";

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

interface ProductDetailProps {
  productId?: string;
  isInPanel?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  productId: propProductId, 
  isInPanel = false 
}) => {
  console.log('🚀 ProductDetail component loaded');

  const { id: paramId } = useParams<{ id: string }>();
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;

  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (!product) {
    return <ProductDetailError />;
  }

  return (
    <div className={isInPanel ? "p-4 bg-white" : "container mx-auto px-4 py-8"}>
      <ProductDetailLayout product={product} productId={productId} isInPanel={isInPanel} />
    </div>
  );
};

export default ProductDetail;