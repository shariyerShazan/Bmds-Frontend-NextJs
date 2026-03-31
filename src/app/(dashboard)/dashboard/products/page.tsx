'use client';

import ProductModal from '@/components/pages/dashboard/ProductModal';
import StockModal from '@/components/pages/dashboard/StockModal';
import ViewProductModal from '@/components/pages/dashboard/ViewProductModal';
import TablePagination from '@/components/shared/TablePagination';
import { useGetProductsQuery, useUpdateProductMutation } from '@/redux/api/productApi';
import { Product } from '@/type/type';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // View details modal state
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

    // Stock management modal state
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [stockingProduct, setStockingProduct] = useState<Product | null>(null);

    // RTK Query
    const { data: productsResponse, isLoading } = useGetProductsQuery({
        page: currentPage,
        limit: pageSize,
        searchTerm: searchTerm || undefined,
        status: 'ACTIVE',
    });
    const [updateProduct] = useUpdateProductMutation();

    const products = productsResponse?.data ?? [];
    const meta = productsResponse?.meta;

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOpenCreate = useCallback(() => {
        setEditingProduct(null);
        setModalOpen(true);
    }, []);

    const handleOpenEdit = useCallback((product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        setEditingProduct(null);
    }, []);

    const handleViewDetails = useCallback((product: Product) => {
        setViewingProduct(product);
        setViewModalOpen(true);
    }, []);

    const handleCloseViewModal = useCallback(() => {
        setViewModalOpen(false);
        setViewingProduct(null);
    }, []);

    const handleOpenStock = useCallback((product: Product) => {
        setStockingProduct(product);
        setStockModalOpen(true);
    }, []);

    const handleCloseStockModal = useCallback(() => {
        setStockModalOpen(false);
        setStockingProduct(null);
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const result = await updateProduct({
                id,
                data: { status: 'INACTIVE' }
            }).unwrap();

            if (result.success) {
                toast.success('Product deleted successfully!');
            }
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to delete product.');
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-transparent text-gray-900 dark:text-gray-100 transition-colors">
            <div className="pt-6 md:pt-2">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Products</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors">Manage your inventory products</p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleOpenCreate}
                            className="!bg-[#272877] !border-none hover:!bg-[#272877]/90 !h-10 !rounded-lg !font-medium"
                        >
                            Add Product
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md">
                        <Input
                            size="large"
                            placeholder="Search products..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="!rounded-lg dark:!bg-[#1a1a1a] dark:!border-[#303030] dark:!text-white"
                            allowClear
                        />
                    </div>
                </div>



                {/* Table Container */}
                <div className="bg-white dark:bg-[#141414] rounded-lg shadow-sm border border-gray-200 dark:border-[#303030] overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                        <table className="min-w-5xl xl:min-w-full divide-y divide-gray-200 dark:divide-[#303030]">
                            {/* Table Header */}
                            <thead className="bg-gray-50 dark:bg-[#1f1f1f] transition-colors">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Brand
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Model
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Cost Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Sale Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px]">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px]">
                                        Bar Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[120px]">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="bg-white dark:bg-[#141414] divide-y divide-gray-200 dark:divide-[#303030] transition-colors">
                                {isLoading ? (
                                    // Loading skeleton rows
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: 10 }).map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-200 dark:bg-[#303030] rounded animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors">
                                            {/* Name */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                                    {product.name}
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 transition-colors">
                                                    {product.category?.name || '—'}
                                                </span>
                                            </td>

                                            {/* Brand */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 transition-colors">
                                                    {product.brand?.name || '—'}
                                                </span>
                                            </td>

                                            {/* Model */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-300 transition-colors">
                                                    {product.model}
                                                </span>
                                            </td>

                                            {/* Cost Price */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                                {formatCurrency(product.costPrice)}
                                            </td>

                                            {/* Sale Price */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors">
                                                {formatCurrency(product.salePrice)}
                                            </td>

                                            {/* Stock */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    product.initStock > 10
                                                        ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                                        : product.initStock > 0
                                                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                        : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                                                }`}>
                                                    {product.initStock}
                                                </span>
                                            </td>

                                            {/* Bar Code */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono transition-colors">
                                                {product.barCode || '—'}
                                            </td>

                                            {/* Created At */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                                {formatDate(product.createdAt)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Button
                                                        type="text"
                                                        icon={<EyeOutlined />}
                                                        size="small"
                                                        className="text-gray-600 hover:text-[#272877]"
                                                        title="View Details"
                                                        onClick={() => handleViewDetails(product)}
                                                    />

                                                    <Button
                                                        type="text"
                                                        icon={<SwapOutlined />}
                                                        size="small"
                                                        className="text-gray-600 hover:text-green-600"
                                                        title="Manage Stock"
                                                        onClick={() => handleOpenStock(product)}
                                                    />
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined />}
                                                        size="small"
                                                        className="text-gray-600 hover:text-blue-600"
                                                        title="Edit Product"
                                                        onClick={() => handleOpenEdit(product)}
                                                    />
                                                    <Popconfirm
                                                        title="Delete Product"
                                                        description="Are you sure you want to delete this product? It will be permanently removed from the list."
                                                        onConfirm={() => handleDelete(product.id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        okButtonProps={{
                                                            className: '!bg-red-500 !border-none hover:!bg-red-600',
                                                        }}
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<DeleteOutlined />}
                                                            size="small"
                                                            className="text-gray-600 hover:text-red-600"
                                                            title="Delete Product"
                                                        />
                                                    </Popconfirm>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {!isLoading && products.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2 transition-colors">No products found</div>
                            <div className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
                                {searchTerm
                                    ? `No results for "${searchTerm}"`
                                    : 'Create your first product to get started'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && meta && meta.total > pageSize && (
                    <div className="mt-6">
                        <TablePagination
                            current={meta.page}
                            pageSize={pageSize}
                            total={meta.total}
                            onChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <ProductModal
                open={modalOpen}
                editingProduct={editingProduct}
                onClose={handleCloseModal}
            />

            {/* View Product Details Modal */}
            <ViewProductModal
                open={viewModalOpen}
                product={viewingProduct}
                onClose={handleCloseViewModal}
            />

            {/* Manage Stock Modal */}
            <StockModal
                open={stockModalOpen}
                product={stockingProduct}
                onClose={handleCloseStockModal}
            />
        </div>
    );
}
