import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import ProductDetailLayout from "@/components/product/ProductDetailLayout";
import ProductDetailLoading from "@/components/product/ProductDetailLoading";
import ProductDetailError from "@/components/product/ProductDetailError";

const DEFAULT_PRODUCT_ID = "aae97882-a3a1-4db5-b4f5-156705cd10ee";

interface ProductDetailProps {
  productId?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId: propProductId }) => {
  console.log('🚀 ProductDetail component loaded');

  const { id: paramId } = useParams<{ id: string }>();
  const productId = propProductId || paramId || DEFAULT_PRODUCT_ID;
  
  const [isEmbedded, setIsEmbedded] = useState(false);
  const { data: product, isLoading } = useProduct(productId);

  useEffect(() => {
    // Check if we're in an iframe (embedded mode)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('embedded') === 'true') {
      setIsEmbedded(true);
      
      // Notify parent window about our height
      const sendHeight = () => {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({
          type: 'IFRAME_HEIGHT',
          height: height
        }, '*');
      };
      
      // Send height initially and on resize
      sendHeight();
      window.addEventListener('resize', sendHeight);
      
      return () => window.removeEventListener('resize', sendHeight);
    }
  }, []);

  // Listen for messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'EMBEDDED_LAYOUT') {
        setIsEmbedded(event.data.isEmbedded);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (isLoading) {
    return <ProductDetailLoading isEmbedded={isEmbedded} />;
  }

  if (!product) {
    return <ProductDetailError isEmbedded={isEmbedded} />;
  }

  return <ProductDetailLayout product={product} productId={productId} isEmbedded={isEmbedded} />;
};

export default ProductDetail;