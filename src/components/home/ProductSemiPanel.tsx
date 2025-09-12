import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useProduct } from '@/hooks/useProduct';
import ProductDetailLayout from '@/components/product/ProductDetailLayout';
import ProductDetailLoading from '@/components/product/ProductDetailLoading';
import ProductDetailError from '@/components/product/ProductDetailError';

interface ProductSemiPanelProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSemiPanel: React.FC<ProductSemiPanelProps> = ({
  productId,
  isOpen,
  onClose,
}) => {
  // Only fetch data and render when the panel is open and we have a product ID
  if (!isOpen || !productId) {
    return null;
  }

  const { data: product, isLoading, error } = useProduct(productId);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[90vh] p-0 overflow-hidden"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-left">
            {product?.name || 'Product Details'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6">
              <ProductDetailLoading />
            </div>
          ) : error || !product ? (
            <div className="p-6">
              <ProductDetailError />
            </div>
          ) : (
            <ProductDetailLayout 
              product={product} 
              productId={productId || ''} 
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductSemiPanel;