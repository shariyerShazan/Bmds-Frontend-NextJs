import VerifyEmailChangeForm from '@/components/pages/auth/VerifyEmailChangeForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Verify Email Change | Inventory Management',
    description: 'Confirm your email address change',
};

export default function VerifyEmailChangePage() {
    return (
        <div className="w-full h-full max-w-7xl">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <Suspense fallback={
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#272877] mx-auto" />
                        </div>
                    }>
                        <VerifyEmailChangeForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
