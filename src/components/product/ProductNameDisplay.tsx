import React from 'react';

interface ProductNameDisplayProps {
  product?: {
    name?: string;
  };
  className?: string;
}

const ProductNameDisplay: React.FC<ProductNameDisplayProps> = ({ 
  product, 
  className = '' 
}) => {
  if (!product || !product.name) return null;
  
  return (
    <div className={`w-full bg-white px-4 py-2 border-b border-gray-100 ${className}`}>
      <h1 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {product.name}
      </h1>
    </div>
  );
};

export default ProductNameDisplay;