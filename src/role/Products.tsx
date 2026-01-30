import React from 'react';

const Products: React.FC = () => {
  return (
    <div className="content-section">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Catalog</h1>
          <p className="text-slate-500 mt-1">Manage your inventory and pricing.</p>
        </div>
      </div>
    </div>
  );
};

export default Products;