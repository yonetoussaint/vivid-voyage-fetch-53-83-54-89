import React from "react";
import StickyCheckoutBar from '@/components/product/StickyCheckoutBar';
import SocialSharePanel from "@/components/product/SocialSharePanel";

interface ProductStickyComponentsProps {
  product: any;
  onBuyNow: () => void;
  sharePanelOpen: boolean;
  setSharePanelOpen: (open: boolean) => void;
}

const ProductStickyComponents: React.FC<ProductStickyComponentsProps> = ({
  product,
  onBuyNow,
  sharePanelOpen,
  setSharePanelOpen
}) => {
  return (
    <>
      <StickyCheckoutBar 
        product={product}
        onBuyNow={onBuyNow}
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
    </>
  );
};

export default ProductStickyComponents;