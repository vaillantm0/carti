import { LayoutGrid, List } from 'lucide-react';
import ProductsGrid from './ProductsGrid';
import { useProductsByCategory } from '../hooks/useProducts';

interface Props {
  category: string;
}

const ProductsByTypeApi = ({ category }: Props) => {
  const { data: products, isLoading, isError, error } = useProductsByCategory(category);

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="text-center text-gray-500">Loading products...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12">
        <div className="text-center text-red-600">{(error as Error)?.message || 'Failed to load products'}</div>
      </div>
    );
  }

  const count = products?.length ?? 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-10 text-xs font-semibold border-b pb-4 text-gray-500 uppercase">
        <span>Showing {count} Products in {category}</span>
        <div className="flex items-center gap-6">
          <LayoutGrid className="w-4 h-4 text-blue-600" />
          <List className="w-4 h-4" />
        </div>
      </div>
      <ProductsGrid products={products ?? []} />
    </div>
  );
};

export default ProductsByTypeApi;
