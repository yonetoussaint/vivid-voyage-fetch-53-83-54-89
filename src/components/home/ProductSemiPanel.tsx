import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import ProductDetail from '@/pages/ProductDetail'; // or wherever it's located

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
        {productId ? (
          <ProductDetail productId={productId} />
        ) : (
          <div className="p-6">
            <div className="text-center text-gray-500">
              No product selected
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProductSemiPanel;