import React from 'react';
import ProductDetail from '@/pages/ProductDetail';
import ProductHeader from '@/components/product/ProductHeader'; // Adjust the import path as needed

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
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Semi Panel */}
      <div className="fixed bottom-0 left-0 right-0 h-[90vh] bg-white z-50 rounded-t-lg shadow-xl overflow-hidden flex flex-col">
        {/* Panel Header with custom close button */}
        <div className="relative flex items-center justify-center py-3 border-b border-gray-200">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          <button 
            onClick={onClose}
            className="absolute right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Header */}
        <ProductHeader 
          inPanel={true}
          onProductDetailsClick={onClose}
          actionButtons={[
            {
              Icon: Heart,
              active: false,
              onClick: () => console.log('Favorite clicked in panel'),
              count: 147
            },
            {
              Icon: Share,
              onClick: () => console.log('Share clicked in panel'),
              count: 23
            }
          ]}
        />

        {/* Scrollable Content with header space */}
        {productId ? (
          <div className="flex-1 overflow-y-auto min-h-0 relative">
            {/* This container accounts for the fixed header */}
            <div className="absolute inset-0 overflow-y-auto pt-16">
              <ProductDetail productId={productId} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              No product selected
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductSemiPanel;