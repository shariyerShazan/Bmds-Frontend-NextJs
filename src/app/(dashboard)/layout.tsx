// Remove 'use client' directive - this is now a server component
import DashboardLayoutClient from '@/components/pages/dashboard/DashboardLayoutClient';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Dashboard | Inventory Management',
    description: 'Dashboard for managing Inventory Management',
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
