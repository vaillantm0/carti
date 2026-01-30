import { Star } from 'lucide-react';
import type { Product } from '../models/product';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Props {
  products: Product[];
}

const ProductsGrid = ({ products }: Props) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
      {products.map(product => (
        <div 
          key={product.id} 
          className="group cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/product/${product.id}`, { state: { product } }); }}
        >
          <div className="bg-gray-50 aspect-square flex items-center justify-center p-8 mb-4 relative overflow-hidden rounded-md border border-gray-100">
            <img 
              src={product.img} 
              alt={product.name}
              className="mix-blend-multiply group-hover:scale-110 transition-transform duration-500 max-h-full object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
              {product.tags}
            </p>
            <h4 className="text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h4>
            <div className="flex justify-center text-yellow-400 mb-1">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i}
                  className={`w-3 h-3 ${
                    i < product.rating 
                      ? 'fill-current text-yellow-400' 
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            <div className="mt-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  addItem(product._id || String(product.id), 1);
                }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
