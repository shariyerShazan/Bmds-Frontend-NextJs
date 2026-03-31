import ForgotPasswordForm from '@/components/pages/auth/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password | Inventory Management',
    description: 'Reset your Inventory Management account password',
};

export default function ForgotPasswordPage() {
    return (
        <div className="w-full h-full max-w-7xl">
            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
}
