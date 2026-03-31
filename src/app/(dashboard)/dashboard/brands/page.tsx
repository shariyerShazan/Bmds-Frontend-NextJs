'use client';

import BrandModal from '@/components/pages/dashboard/BrandModal';
import TablePagination from '@/components/shared/TablePagination';
import { useGetBrandsQuery, useUpdateBrandMutation } from '@/redux/api/brandApi';
import { Brand } from '@/type/type';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export default function BrandsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    // RTK Query
    const { data: brandsResponse, isLoading } = useGetBrandsQuery({
        page: currentPage,
        limit: pageSize,
        searchTerm: searchTerm || undefined,
        status: 'ACTIVE',
    });
    const [updateBrand] = useUpdateBrandMutation();

    const brands = brandsResponse?.data ?? [];
    const meta = brandsResponse?.meta;

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOpenCreate = useCallback(() => {
        setEditingBrand(null);
        setModalOpen(true);
    }, []);

    const handleOpenEdit = useCallback((brand: Brand) => {
        setEditingBrand(brand);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        setEditingBrand(null);
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const result = await updateBrand({
                id,
                data: { status: 'INACTIVE' }
            }).unwrap();
            if (result.success) {
                toast.success('Brand deleted successfully!');
            }
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to delete brand.');
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });
    };

    return (
        <div className="bg-transparent text-gray-900 dark:text-gray-100 transition-colors">
            <div className="pt-6 md:pt-2">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Brands</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors">Manage your product brands</p>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleOpenCreate}
                            className="!bg-[#272877] !border-none hover:!bg-[#272877]/90 !h-10 !rounded-lg !font-medium"
                        >
                            Add Brand
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md">
                        <Input
                            size="large"
                            placeholder="Search brands..."
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
                        <table className="min-w-4xl xl:min-w-full divide-y divide-gray-200 dark:divide-[#303030]">
                            {/* Table Header */}
                            <thead className="bg-gray-50 dark:bg-[#1f1f1f] transition-colors">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[150px]">
                                        Slug
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[280px]">
                                        Description
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
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-gray-200 dark:bg-[#303030] rounded animate-pulse" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    brands.map((brand) => (
                                        <tr key={brand.id} className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors">
                                            {/* Name */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {brand.name}
                                                </div>
                                            </td>

                                            {/* Slug */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-300 transition-colors">
                                                    {brand.slug}
                                                </span>
                                            </td>

                                            {/* Description */}
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-xs transition-colors">
                                                    {brand.description || '—'}
                                                </div>
                                            </td>

                                            {/* Created At */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 transition-colors">
                                                {formatDate(brand.createdAt)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined />}
                                                        size="small"
                                                        className="text-gray-600 hover:text-blue-600"
                                                        title="Edit Brand"
                                                        onClick={() => handleOpenEdit(brand)}
                                                    />
                                                    <Popconfirm
                                                        title="Delete Brand"
                                                        description="Are you sure you want to delete this brand?"
                                                        onConfirm={() => handleDelete(brand.id)}
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
                                                            title="Delete Brand"
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
                    {!isLoading && brands.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2 transition-colors">No brands found</div>
                            <div className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
                                {searchTerm
                                    ? `No results for "${searchTerm}"`
                                    : 'Create your first brand to get started'}
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

            {/* Brand Modal */}
            <BrandModal
                open={modalOpen}
                editingBrand={editingBrand}
                onClose={handleCloseModal}
            />
        </div>
    );
}
