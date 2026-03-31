import SetNewPasswordForm from '@/components/pages/auth/SetNewPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Set New Password | Inventory Management',
    description: 'Set your new Inventory Management account password',
};

export default function SetNewPasswordPage() {
    return (
        <div className="w-full h-full max-w-7xl">
            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <SetNewPasswordForm />
                </div>
            </div>
        </div>
    );
}
