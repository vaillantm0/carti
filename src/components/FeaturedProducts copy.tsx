import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import CategoryNavRemote from './CategoryNavRemote';
import { useProducts } from '../hooks/useProducts';

const FeaturedProducts = () => {
  const { data: products, isLoading, isError, error } = useProducts();
  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-gray-500">
        Loading featured products...
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center text-red-600">
        {(error as Error)?.message || 'Failed to load featured products'}
      </div>
    );
  }

  const featuredProducts = products ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      {/* Category navigation */}
      <CategoryNavRemote />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 mb-8">
        <h2 className="text-xl uppercase tracking-wider font-semibold">
          Featured Products
        </h2>
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-500 text-white py-2 px-5 rounded text-xs font-bold uppercase hover:bg-blue-600"
        >
          View All
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-5 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white cursor-pointer"
            onClick={() => navigate(`/shop/${product.categoryPath}`)}
          >
            <div className="relative bg-gray-50 aspect-[4/5] flex items-center justify-center overflow-hidden mb-4 rounded">
              <span className="absolute top-2 left-0 bg-[#f39c12] text-white py-1 px-3 text-[10px] font-bold uppercase z-10">
                Featured
              </span>

              <button
                className="absolute top-3 right-3 text-gray-400 text-lg hover:text-red-500 transition z-10"
                onClick={(e) => e.stopPropagation()} // Prevent navigating when clicking heart
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-left">
              <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                {product.category}
              </div>
              <div className="font-semibold text-[13px] text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {product.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {featuredProducts.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No featured products available.
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
