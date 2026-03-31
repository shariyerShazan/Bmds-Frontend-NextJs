'use client';

import { useGetBrandsQuery } from '@/redux/api/brandApi';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import {
    useCreateProductMutation,
    useUpdateProductMutation,
} from '@/redux/api/productApi';
import { Product } from '@/type/type';
import { ShoppingOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ProductModalProps {
    open: boolean;
    editingProduct: Product | null;
    onClose: () => void;
}

export default function ProductModal({ open, editingProduct, onClose }: ProductModalProps) {
    const [form] = Form.useForm();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const isEditing = !!editingProduct;
    const isSubmitting = isCreating || isUpdating;

    // ── Lazy-loading Category dropdown ──
    const [categorySearch, setCategorySearch] = useState('');
    const { data: categoriesResponse, isFetching: isCategoriesLoading } = useGetCategoriesQuery({
        limit: 20,
        searchTerm: categorySearch || undefined,
        status: 'ACTIVE',
    });

    const categoryOptions = useMemo(() =>
        (categoriesResponse?.data ?? []).map((cat) => ({
            label: cat.name,
            value: cat.id,
        })),
        [categoriesResponse]
    );

    const handleCategorySearch = useCallback((value: string) => {
        setCategorySearch(value);
    }, []);

    // ── Lazy-loading Brand dropdown ──
    const [brandSearch, setBrandSearch] = useState('');
    const { data: brandsResponse, isFetching: isBrandsLoading } = useGetBrandsQuery({
        limit: 20,
        searchTerm: brandSearch || undefined,
        status: 'ACTIVE',
    });

    const brandOptions = useMemo(() =>
        (brandsResponse?.data ?? []).map((brand) => ({
            label: brand.name,
            value: brand.id,
        })),
        [brandsResponse]
    );

    const handleBrandSearch = useCallback((value: string) => {
        setBrandSearch(value);
    }, []);

    useEffect(() => {
        if (open) {
            if (editingProduct) {
                form.setFieldsValue({
                    name: editingProduct.name,
                    model: editingProduct.model,
                    costPrice: editingProduct.costPrice,
                    salePrice: editingProduct.salePrice,
                    initStock: editingProduct.initStock,
                    description: editingProduct.description,
                    barCode: editingProduct.barCode,
                    categoryId: editingProduct.categoryId,
                    brandId: editingProduct.brandId,
                });
            } else {
                form.resetFields();
            }
            setCategorySearch('');
            setBrandSearch('');
        }
    }, [open, editingProduct, form]);

    interface ProductFormValues {
        name: string;
        model: string;
        costPrice: number;
        salePrice: number;
        initStock: number;
        description?: string;
        barCode?: string;
        categoryId: string;
        brandId: string;
    }

    const handleSubmit = async (values: ProductFormValues) => {
        try {
            if (isEditing) {
                const result = await updateProduct({
                    id: editingProduct!.id,
                    data: values,
                }).unwrap();
                if (result.success) {
                    toast.success(result.message || 'Product updated successfully!');
                }
            } else {
                const result = await createProduct(values).unwrap();
                if (result.success) {
                    toast.success(result.message || 'Product created successfully!');
                }
            }
            onClose();
            form.resetFields();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product.`);
        }
    };

    const inputClasses = '!py-2 !h-11 !rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#1a1a1a] dark:!text-white hover:!border-[#272877] focus:!border-[#272877] dark:hover:!border-[#6e6fe4] transition-all';
    const labelClasses = 'text-gray-700 dark:text-gray-300 font-medium text-sm mb-1 block transition-colors';

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-2 pt-1 border-b border-gray-100 dark:border-[#303030] mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272877]/10 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4]">
                        <ShoppingOutlined className="text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                            {isEditing ? 'Update product details' : 'Add a new product to your inventory'}
                        </p>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            className="custom-modal [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6 [&_.ant-modal-content]:dark:!bg-[#141414] [&_.ant-modal-close]:!top-6 [&_.ant-modal-close]:!right-6"
            width={640}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="mt-2"
            >
                {/* Row 1: Name + Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <Form.Item
                        label={<span className={labelClasses}>Name</span>}
                        name="name"
                        rules={[{ required: true, message: 'Please enter a product name' }]}
                    >
                        <Input
                            placeholder="e.g. iPhone 16 Pro"
                            className={inputClasses}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Model</span>}
                        name="model"
                        rules={[{ required: true, message: 'Please enter the model' }]}
                    >
                        <Input
                            placeholder="e.g. A3102"
                            className={inputClasses}
                        />
                    </Form.Item>
                </div>

                {/* Row 2: Cost Price + Sale Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <Form.Item
                        label={<span className={labelClasses}>Cost Price</span>}
                        name="costPrice"
                        rules={[{ required: true, message: 'Please enter the cost price' }]}
                    >
                        <InputNumber
                            placeholder="e.g. 950"
                            min={0}
                            className={`${inputClasses} !w-full`}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Sale Price</span>}
                        name="salePrice"
                        rules={[{ required: true, message: 'Please enter the sale price' }]}
                    >
                        <InputNumber
                            placeholder="e.g. 1199"
                            min={0}
                            className={`${inputClasses} !w-full`}
                        />
                    </Form.Item>
                </div>

                {/* Row 3: Initial Stock + Bar Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {!isEditing && (
                        <Form.Item
                            label={<span className={labelClasses}>Initial Stock</span>}
                            name="initStock"
                            rules={[{ required: true, message: 'Please enter the initial stock' }]}
                        >
                            <InputNumber
                                placeholder="e.g. 50"
                                min={0}
                                className={`${inputClasses} !w-full`}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        label={<span className={labelClasses}>Bar Code</span>}
                        name="barCode"
                    >
                        <Input
                            placeholder="e.g. 1234567890123"
                            className={inputClasses}
                        />
                    </Form.Item>
                </div>

                {/* Row 4: Category + Brand (lazy-loading selects) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    <Form.Item
                        label={<span className={labelClasses}>Category</span>}
                        name="categoryId"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a category"
                            filterOption={false}
                            onSearch={handleCategorySearch}
                            loading={isCategoriesLoading}
                            options={categoryOptions}
                            notFoundContent={isCategoriesLoading ? 'Loading...' : 'No categories found'}
                            className="!rounded-xl"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className={labelClasses}>Brand</span>}
                        name="brandId"
                        rules={[{ required: true, message: 'Please select a brand' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a brand"
                            filterOption={false}
                            onSearch={handleBrandSearch}
                            loading={isBrandsLoading}
                            options={brandOptions}
                            notFoundContent={isBrandsLoading ? 'Loading...' : 'No brands found'}
                            className="!rounded-xl"
                            size="large"
                        />
                    </Form.Item>
                </div>

                {/* Row 5: Description */}
                <Form.Item
                    label={<span className={labelClasses}>Description</span>}
                    name="description"
                >
                    <Input.TextArea
                        placeholder="Brief description of this product (optional)..."
                        rows={3}
                        className="!py-2.5 !px-4 !rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#1a1a1a] dark:!text-white hover:!border-[#272877] focus:!border-[#272877] dark:hover:!border-[#6e6fe4] transition-all"
                    />
                </Form.Item>

                <Divider className="my-4 dark:border-[#303030]" />

                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onClose}
                        className="!h-11 !px-6 !rounded-xl !font-medium !text-gray-600 dark:!text-gray-300 dark:!bg-[#1f1f1f] dark:!border-[#303030] hover:dark:!bg-[#2c2c2c] transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        className="!bg-[#272877] !border-none hover:!bg-[#1e1f5e] dark:!bg-[#6e6fe4] dark:hover:!bg-[#5c5cd6] !h-11 !px-8 !rounded-xl !font-medium shadow-md shadow-[#272877]/20 dark:shadow-[#6e6fe4]/20 !transition-all"
                    >
                        {isEditing ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
