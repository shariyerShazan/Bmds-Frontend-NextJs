'use client';

import { useGetAnalyticsQuery } from '@/redux/api/analyticsApi';
import { RootState } from '@/redux/store';
import { AppstoreOutlined, FileTextOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function DashboardOverview() {
    const { data: analyticsResponse, isLoading } = useGetAnalyticsQuery();
    const analytics = analyticsResponse?.data;
    const user = useSelector((state: RootState) => state.auth.user);

    const stats = [
        {
            title: 'Total Categories',
            value: analytics?.totalCategories ?? 0,
            icon: <AppstoreOutlined />,
            bgLight: 'bg-blue-50 dark:bg-blue-500/10',
            textColor: 'text-blue-600 dark:text-blue-400',
            link: '/dashboard/categories',
        },
        {
            title: 'Total Products',
            value: analytics?.totalProducts ?? 0,
            icon: <ShoppingOutlined />,
            bgLight: 'bg-emerald-50 dark:bg-emerald-500/10',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            link: '/dashboard/products',
        },
        {
            title: 'Total Transactions',
            value: analytics?.totalReports ?? 0,
            icon: <FileTextOutlined />,
            bgLight: 'bg-violet-50 dark:bg-violet-500/10',
            textColor: 'text-violet-600 dark:text-violet-400',
            link: '/dashboard/reports',
        },
    ];

    const quickActions = [
        { title: 'Add Product', desc: 'Create a new product entry', href: '/dashboard/products', icon: <ShoppingOutlined /> },
        { title: 'View Reports', desc: 'Download weekly or monthly reports', href: '/dashboard/reports', icon: <FileTextOutlined /> },
        { title: 'Manage Categories', desc: 'Add or edit product categories', href: '/dashboard/categories', icon: <AppstoreOutlined /> },
        ...(user?.role === 'ADMIN'
            ? [{ title: 'Settings', desc: 'Manage employees & profile', href: '/dashboard/settings', icon: <SettingOutlined /> }]
            : [{ title: 'My Profile', desc: 'View your account settings', href: '/dashboard/settings', icon: <SettingOutlined /> }]
        ),
    ];

    return (
        <div className="bg-transparent text-gray-900 dark:text-gray-100 transition-colors">
            <div className="pt-6 md:pt-2">
                {/* Welcome Header */}
                <div className="mb-8 space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Dashboard Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                        A quick glance at your inventory system
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat) => (
                        <Link href={stat.link} key={stat.title} className="group">
                            <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bgLight} transition-colors`}>
                                        <span className={`text-xl ${stat.textColor}`}>{stat.icon}</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-[#272877] dark:group-hover:text-[#6e6fe4] transition-colors">
                                        View →
                                    </span>
                                </div>
                                <div>
                                    {isLoading ? (
                                        <div className="h-10 w-20 bg-gray-200 dark:bg-[#303030] rounded-lg animate-pulse" />
                                    ) : (
                                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
                                            {stat.value.toLocaleString()}
                                        </p>
                                    )}
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 transition-colors">{stat.title}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] overflow-hidden transition-colors">
                    <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-gray-100 dark:border-[#303030] transition-colors">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white transition-colors">Quick Actions</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">Navigate to common tasks</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-[#303030]">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group flex items-center gap-4 px-6 sm:px-8 py-5 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] transition-colors"
                            >
                                <div className="p-2.5 rounded-xl bg-[#272877]/5 dark:bg-[#6e6fe4]/10 text-[#272877] dark:text-[#6e6fe4] group-hover:bg-[#272877]/10 dark:group-hover:bg-[#6e6fe4]/20 transition-colors text-lg">
                                    {action.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#272877] dark:group-hover:text-[#6e6fe4] transition-colors">
                                        {action.title}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">{action.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
