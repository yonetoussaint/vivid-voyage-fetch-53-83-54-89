import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ProductDetail from '@/pages/ProductDetail';

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
        className="h-[90vh] p-0 overflow-hidden flex flex-col"
      >
        {productId ? (
          <>
            {/* Optional: Add a header with title */}
            <SheetHeader className="px-6 py-4 border-b shrink-0">
              <SheetTitle className="text-left">
                Product Details
              </SheetTitle>
            </SheetHeader>
            
            {/* Constrained container for ProductDetail */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {/* Wrapper to override any global styles that might cause overflow */}
                <div className="max-w-none w-full min-h-0">
                  <ProductDetail productId={productId} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              No product selected
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};