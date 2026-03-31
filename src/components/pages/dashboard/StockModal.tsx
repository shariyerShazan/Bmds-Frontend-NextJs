'use client';

import { useCreateReportMutation } from '@/redux/api/reportApi';
import { Product } from '@/type/type';
import { ArrowDownOutlined, ArrowUpOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Divider, Form, InputNumber, Modal, Radio } from 'antd';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface StockModalProps {
    open: boolean;
    product: Product | null;
    onClose: () => void;
}

export default function StockModal({ open, product, onClose }: StockModalProps) {
    const [form] = Form.useForm();
    const [createReport, { isLoading: isSubmitting }] = useCreateReportMutation();

    useEffect(() => {
        if (open && product) {
            form.setFieldsValue({
                type: 'IN', // Default to Stock In
                qty: 1,
            });
        } else {
            form.resetFields();
        }
    }, [open, product, form]);

    const handleSubmit = async (values: { type: 'IN' | 'OUT'; qty: number }) => {
        if (!product) return;

        try {
            const result = await createReport({
                productId: product.id,
                type: values.type,
                qty: values.qty,
            }).unwrap();

            if (result.success) {
                toast.success(
                    result.message ||
                        `Stock ${values.type === 'IN' ? 'added to' : 'removed from'} successfully!`
                );
                onClose();
            }
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Failed to update stock.');
        }
    };

    const labelClasses = 'text-gray-700 dark:text-gray-300 font-medium transition-colors';
    const inputClasses =
        '!py-2 !h-12 !rounded-xl !border-gray-200 dark:!border-[#303030] dark:!bg-[#1a1a1a] dark:!text-white hover:!border-[#272877] focus:!border-[#272877] dark:hover:!border-[#6e6fe4] dark:focus:!border-[#6e6fe4] transition-all !text-lg !font-medium';

    const typeValue = Form.useWatch('type', form);

    return (
        <Modal
            title={
                <div className="flex flex-col gap-1 pb-4 pt-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272877]/10 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4]">
                            <InboxOutlined className="text-xl" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                            Manage Stock
                        </span>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
            className="custom-modal [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6 [&_.ant-modal-content]:dark:!bg-[#141414] [&_.ant-modal-close]:!top-6 [&_.ant-modal-close]:!right-6 [&_.ant-modal-close]:!w-8 [&_.ant-modal-close]:!h-8 [&_.ant-modal-close]:!rounded-full [&_.ant-modal-close]:hover:!bg-gray-100 [&_.ant-modal-close]:dark:hover:!bg-[#2c2c2c] [&_.ant-modal-close_svg]:!w-4 [&_.ant-modal-close_svg]:!h-4"
            width={440}
        >
            {product && (
                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 mb-6 border border-gray-100 dark:border-[#303030] transition-colors">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base mb-1">{product.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>Model <strong className="text-gray-700 dark:text-gray-300 font-medium">{product.model}</strong></span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span>Current Stock <strong className={`font-semibold ${product.initStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{product.initStock}</strong></span>
                    </div>
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                className="mt-2"
            >
                <Form.Item
                    label={<span className={`${labelClasses} text-sm mb-1 block`}>Action Type</span>}
                    name="type"
                    rules={[{ required: true, message: 'Please select an action type' }]}
                >
                    <Radio.Group
                        className="w-full grid! grid-cols-2! gap-2 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/60 dark:border-[#303030] dark:bg-[#111111] transition-colors"
                        optionType="button"
                        buttonStyle="solid"
                    >
                        <Radio.Button
                            value="IN"
                            className="w-full! text-center !rounded-lg inline-flex! items-center! justify-center! before:!hidden border-none text-gray-500 hover:text-[#272877] data-[state=checked]:!bg-white data-[state=checked]:!text-[#272877] dark:text-gray-400 dark:hover:text-[#6e6fe4] dark:data-[state=checked]:!bg-[#1f1f1f] dark:data-[state=checked]:!text-[#6e6fe4] shadow-none data-[state=checked]:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:data-[state=checked]:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all font-semibold text-[15px] group bg-transparent"
                        >
                            <div className="flex items-center gap-2">
                                <ArrowDownOutlined className={`text-sm transition-transform duration-300 ${typeValue === 'IN' ? 'translate-y-0.5' : ''}`} />
                                Stock In
                            </div>
                        </Radio.Button>
                        <Radio.Button
                            value="OUT"
                            className="w-full! text-center !rounded-lg inline-flex! items-center! justify-center! before:!hidden border-none text-gray-500 hover:text-red-600 data-[state=checked]:!bg-white data-[state=checked]:!text-red-600 dark:text-gray-400 dark:hover:text-red-400 dark:data-[state=checked]:!bg-[#1f1f1f] dark:data-[state=checked]:!text-red-400 shadow-none data-[state=checked]:shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:data-[state=checked]:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all font-semibold text-[15px] group bg-transparent"
                        >
                            <div className="flex items-center gap-2">
                                <ArrowUpOutlined className={`text-sm transition-transform duration-300 ${typeValue === 'OUT' ? '-translate-y-0.5' : ''}`} />
                                Stock Out
                            </div>
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label={<span className={`${labelClasses} text-sm mb-1 block`}>Quantity</span>}
                    name="qty"
                    rules={[
                        { required: true, message: 'Please enter the quantity' },
                        { type: 'number', min: 1, message: 'Quantity must be at least 1' },
                    ]}
                >
                    <InputNumber
                        placeholder="e.g. 50"
                        min={1}
                        className={`${inputClasses} !w-full`}
                    />
                </Form.Item>

                <Divider className="my-6 dark:border-[#303030]" />

                <div className="flex justify-end gap-3 mt-2">
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
                        className={`!border-none !h-11 !px-8 !rounded-xl !font-medium shadow-md transition-all ${
                            typeValue === 'OUT'
                                ? '!bg-red-500 hover:!bg-red-600 shadow-red-500/20'
                                : '!bg-[#272877] hover:!bg-[#1e1f5e] dark:!bg-[#6e6fe4] dark:hover:!bg-[#5c5cd6] shadow-[#272877]/20 dark:shadow-[#6e6fe4]/20'
                        }`}
                    >
                        {typeValue === 'OUT' ? 'Confirm Removal' : 'Confirm Addition'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
