import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
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
            {/* Enhanced scrollable container with debugging */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
              <div 
                className="absolute inset-0 overflow-y-auto overflow-x-hidden"
                style={{ 
                  // Force scrollbar to appear for debugging
                  scrollbarWidth: 'thin',
                  // Ensure smooth scrolling
                  scrollBehavior: 'smooth'
                }}
              >
                {/* Content wrapper with proper constraints */}
                <div className="min-h-full p-0">
                  {/* Force ProductDetail to respect container bounds */}
                  <div 
                    className="w-full" 
                    style={{ 
                      // Override any fixed heights or viewport units
                      maxHeight: 'none',
                      height: 'auto'
                    }}
                  >
                    <ProductDetail productId={productId} />
                  </div>
                  
                  {/* Debug: Add some extra content to test scrolling */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="p-4 bg-yellow-100 border border-yellow-300 m-4">
                      <p className="text-sm text-yellow-800">
                        Debug: If you can scroll to see this, scrolling works!
                      </p>
                      <div className="h-20 bg-yellow-200 mt-2 flex items-center justify-center">
                        Extra height for testing scroll
                      </div>
                    </div>
                  )}
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

export default ProductSemiPanel;