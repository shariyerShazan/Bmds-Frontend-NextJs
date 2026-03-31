'use client';

import { Product } from '@/type/type';
import { EyeOutlined } from '@ant-design/icons';
import { Modal, Tag } from 'antd';

interface ViewProductModalProps {
    open: boolean;
    product: Product | null;
    onClose: () => void;
}

export default function ViewProductModal({ open, product, onClose }: ViewProductModalProps) {
    if (!product) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const profit = product.salePrice - product.costPrice;
    const profitPercentage = product.costPrice > 0
        ? ((profit / product.costPrice) * 100).toFixed(1)
        : '0';

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-2 pt-1 border-b border-gray-100 dark:border-[#303030] mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#272877]/10 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4]">
                        <EyeOutlined className="text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                            Product Details
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                            View complete product information
                        </p>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            className="custom-modal [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6 [&_.ant-modal-content]:dark:!bg-[#141414] [&_.ant-modal-close]:!top-6 [&_.ant-modal-close]:!right-6"
            width={560}
        >
            <div className="space-y-5">
                {/* Product Name & Model */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">
                        Model: {product.model}
                    </p>
                </div>

                {/* Tags: Category & Brand */}
                <div className="flex flex-wrap gap-2">
                    <Tag color="blue" className="!text-xs !font-medium !px-2.5 !py-0.5 !rounded-full">
                        {product.category?.name || 'Uncategorized'}
                    </Tag>
                    <Tag color="purple" className="!text-xs !font-medium !px-2.5 !py-0.5 !rounded-full">
                        {product.brand?.name || 'No Brand'}
                    </Tag>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-3.5 border border-gray-100 dark:border-[#303030] transition-colors">
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1 transition-colors">Cost Price</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white transition-colors">{formatCurrency(product.costPrice)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-3.5 border border-gray-100 dark:border-[#303030] transition-colors">
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1 transition-colors">Sale Price</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white transition-colors">{formatCurrency(product.salePrice)}</p>
                    </div>
                    <div className={`rounded-xl p-3.5 border transition-colors ${profit >= 0
                        ? 'bg-green-50 dark:bg-green-500/5 border-green-100 dark:border-green-500/20'
                        : 'bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20'
                    }`}>
                        <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1 transition-colors">Margin</p>
                        <p className={`text-base font-bold transition-colors ${profit >= 0
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}>
                            {profitPercentage}%
                        </p>
                    </div>
                </div>

                {/* Details List */}
                <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#303030] divide-y divide-gray-100 dark:divide-[#303030] transition-colors">
                    <DetailRow label="Current Stock" value={
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            product.initStock > 10
                                ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                                : product.initStock > 0
                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                        }`}>
                            {product.initStock} units
                        </span>
                    } />
                    <DetailRow label="Bar Code" value={product.barCode || '—'} mono />
                    <DetailRow label="Created" value={formatDate(product.createdAt)} />
                    <DetailRow label="Last Updated" value={formatDate(product.updatedAt)} />
                </div>

                {/* Description */}
                {product.description && (
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1.5 transition-colors">Description</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-100 dark:border-[#303030] transition-colors">
                            {product.description}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">{label}</span>
            <span className={`text-sm font-medium text-gray-900 dark:text-white transition-colors ${mono ? 'font-mono' : ''}`}>
                {value}
            </span>
        </div>
    );
}
