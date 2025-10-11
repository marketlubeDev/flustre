import React from "react";
import ProductTableHeader from "./ProductTableHeader";
import ProductTableRow from "./ProductTableRow";
import PaginationFooter from "../Pagination/PaginationFooter";

const ProductTable = ({
  products,
  onSelectAll,
  selectedProducts,
  setSelectedProducts,
  role,
  selectedProductsCount,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  refetchProducts,
  onBulkDelete,
  onBulkStatusUpdate,
}) => (
  <div className="overflow-hidden bg-white rounded-lg shadow">
    <table className="min-w-full divide-y divide-gray-200">
      <ProductTableHeader
        onSelectAll={onSelectAll}
        selectedProductsCount={selectedProductsCount}
        products={products}
        currentPage={currentPage}
        selectedProducts={selectedProducts}
        onBulkDelete={onBulkDelete}
        onBulkStatusUpdate={onBulkStatusUpdate}
      />
      <tbody className="bg-white divide-y divide-gray-200">
        {products?.map((product, index) => (
          <ProductTableRow
            key={product._id}
            product={product}
            onSelectAll={onSelectAll}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            role={role}
            refetchProducts={refetchProducts}
            index={index}
          />
        ))}
      </tbody>
    </table>
    <PaginationFooter
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onItemsPerPageChange={onItemsPerPageChange}
      onPageChange={onPageChange}
    />
  </div>
);

export default ProductTable;
