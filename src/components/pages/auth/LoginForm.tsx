'use client';

import Logo from '@/components/shared/Logo';
import { useLazyGetMeQuery, useLoginMutation } from '@/redux/api/authApi';
import { setAccessToken, setUser } from '@/redux/features/authSlice';
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

export default function LoginForm() {
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const [getMe] = useLazyGetMeQuery();

    const onFinish = async (values: LoginFormData) => {
        try {
            const result = await login({
                email: values.email,
                password: values.password,
            }).unwrap();

            if (result.success) {
                // Store access token in Redux
                dispatch(setAccessToken(result.data.access_token));

                // Set access token cookie for middleware auth checks
                document.cookie = `accessToken=${result.data.access_token}; path=/;`;

                // Fetch user profile after successful login
                const meResult = await getMe().unwrap();
                if (meResult.success) {
                    dispatch(setUser(meResult.data));
                }
                toast.success('Login successful!');
                router.push('/dashboard');
            }
        } catch (error: unknown) {
            const err = error as { data?: { message?: string } };
            toast.error(err?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header Outside of Card */}
            <div className="text-center mb-8 flex flex-col items-center">
                <Logo className="mb-10 scale-120" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2 transition-colors">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400 text-base transition-colors">Sign in to your account</p>
            </div>

            {/* Card Container */}
            <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-8 sm:p-10 mb-8 mt-2 transition-colors">

                {/* Form */}
                <Form
                    form={form}
                    name="loginForm"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                    initialValues={{
                        email: '',
                        password: '',
                        remember: false,
                    }}
                >
                    {/* Email Field */}
                    <Form.Item
                        label={<span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">Email</span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            placeholder="admin@gmail.com"
                            className="h-12 rounded-xl border-gray-200 dark:border-[#303030] dark:bg-[#1f1f1f] dark:text-white hover:border-[#272877] dark:hover:border-[#6e6fe4] focus:border-[#272877] transition-colors"
                            prefix={<UserOutlined className="text-gray-400 dark:text-gray-500 mr-2" />}
                        />
                    </Form.Item>

                    {/* Password Field */}
                    <Form.Item
                        label={<span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">Password</span>}
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                        className="!mb-2"
                    >
                        <Input.Password
                            placeholder="••••••••••••"
                            className="h-12 rounded-xl border-gray-200 dark:border-[#303030] dark:bg-[#1f1f1f] dark:text-white hover:border-[#272877] dark:hover:border-[#6e6fe4] focus:border-[#272877] transition-colors"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined className="dark:text-gray-500" />)}
                            prefix={<LockOutlined className="text-gray-400 dark:text-gray-500 mr-2" />}
                        />
                    </Form.Item>

                    {/* Forgot Password Link & Remember Me container */}
                    <div className="flex items-center justify-between mb-8">
                        {/* Remember Me */}
                        <Form.Item name="remember" valuePropName="checked" className="!mb-0">
                            <Checkbox className="text-gray-600 dark:text-gray-400 transition-colors">
                                Remember me
                            </Checkbox>
                        </Form.Item>

                        <Link
                            href="/auth/forgot-password"
                            className="text-sm font-medium text-[#272877] dark:text-[#6e6fe4] hover:text-[#4143a3] dark:hover:text-[#8e8fed] transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Login Button */}
                    <Form.Item className="!mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            block
                            className="h-12 rounded-xl !bg-[#272877] !border-none font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
