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
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && productId) {
      // Add panel parameter to the URL so the page knows it's being displayed in a panel
      setIframeUrl(`/product/${productId}?panel=true&embedded=true`);
      setIsLoading(true);
    } else {
      setIframeUrl(null);
    }
  }, [isOpen, productId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    // Once iframe is loaded, send a message to adjust the layout
    setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'EMBEDDED_LAYOUT',
          isEmbedded: true
        }, '*');
      }
    }, 100);
  };

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'IFRAME_HEIGHT') {
        // Adjust iframe height based on content
        if (iframeRef.current) {
          iframeRef.current.style.height = `${event.data.height}px`;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with fade-in animation */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Semi Panel with slide-up animation */}
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 rounded-t-2xl shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-300">
        {/* Drag handle */}
        <div className="flex justify-center py-2 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
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
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        )}

        {/* Iframe container */}
        <div className="flex-1 relative overflow-y-auto">
          {iframeUrl ? (
            <iframe 
              ref={iframeRef}
              src={iframeUrl}
              className="w-full h-full border-none"
              onLoad={handleIframeLoad}
              sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-top-navigation-by-user-activation"
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Product Details"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9h6m-6 3h6m-6 3h6" />
                </svg>
                <p>No product selected</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductSemiPanel;