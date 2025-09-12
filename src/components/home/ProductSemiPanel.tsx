import React, { useState, useEffect } from 'react';

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
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && productId) {
      // Add a modal parameter to the URL so the page knows it's being displayed in a panel
      setIframeUrl(`/product/${productId}?modal=true&panel=true`);
      setIsLoading(true);
    } else {
      setIframeUrl(null);
    }
  }, [isOpen, productId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

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
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-800">
            Product Details
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        )}

        {/* Iframe container */}
        <div className="flex-1 relative">
          {iframeUrl ? (
            <iframe 
              src={iframeUrl}
              className="w-full h-full border-none"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-top-navigation-by-user-activation"
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                No product selected
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductSemiPanel;