'use client';

import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from '@/redux/api/categoryApi';
import { Category } from '@/type/type';
import { AppstoreOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface CategoryModalProps {
    open: boolean;
    editingCategory: Category | null;
    onClose: () => void;
}

export default function CategoryModal({ open, editingCategory, onClose }: CategoryModalProps) {
    const [form] = Form.useForm();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const isEditing = !!editingCategory;
    const isSubmitting = isCreating || isUpdating;

    useEffect(() => {
        if (open) {
            if (editingCategory) {
                form.setFieldsValue({
                    name: editingCategory.name,
                    description: editingCategory.description,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, editingCategory, form]);

    const handleSubmit = async (values: { name: string; description?: string }) => {
        try {
            if (isEditing) {
                const result = await updateCategory({
                    id: editingCategory!.id,
                    data: values,
                }).unwrap();
                if (result.success) {
                    toast.success(result.message || 'Category updated successfully!');
                }
            } else {
                const result = await createCategory(values).unwrap();
                if (result.success) {
                    toast.success(result.message || 'Category created successfully!');
                }
            }
            onClose();
            form.resetFields();
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} category.`);
        }
    };

    const labelClasses = 'text-gray-700 dark:text-gray-300 font-medium text-sm mb-1 block transition-colors';
    const inputClasses = '!py-2 !h-11 !rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#1a1a1a] dark:!text-white hover:!border-[#272877] focus:!border-[#272877] dark:hover:!border-[#6e6fe4] transition-all';

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-2 pt-1 border-b border-gray-100 dark:border-[#303030] mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272877]/10 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4]">
                        <AppstoreOutlined className="text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                            {isEditing ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                            {isEditing ? 'Update category details' : 'Create a new product category'}
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
            width={440}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="mt-2"
            >
                <Form.Item
                    label={<span className={labelClasses}>Name</span>}
                    name="name"
                    rules={[{ required: true, message: 'Please enter a category name' }]}
                >
                    <Input
                        placeholder="e.g. Electronics"
                        className={inputClasses}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className={labelClasses}>Description</span>}
                    name="description"
                >
                    <Input.TextArea
                        placeholder="Brief description of this category..."
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
                        {isEditing ? 'Update Category' : 'Create Category'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
