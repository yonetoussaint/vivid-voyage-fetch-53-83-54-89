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
        className="h-[90vh] p-0 flex flex-col"
        // Remove overflow-hidden from here to let content determine scroll
      >
        {productId ? (
          <>
            <SheetHeader className="px-6 py-4 border-b flex-shrink-0 bg-white z-10">
              <SheetTitle className="text-left">
                Product Details
              </SheetTitle>
            </SheetHeader>
            
            {/* Simple scrollable approach */}
            <div 
              className="flex-1 p-0"
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                // Ensure it takes remaining height
                height: 'calc(90vh - 73px)', // 73px is approximate header height
                maxHeight: 'calc(90vh - 73px)'
              }}
            >
              <ProductDetail productId={productId} />
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

export default ProductSemiPanel;