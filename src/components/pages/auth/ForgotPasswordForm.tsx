"use client";

import Logo from "@/components/shared/Logo";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { toast } from "sonner";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordForm() {
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values: ForgotPasswordFormData) => {
    try {
      const result = await forgotPassword({ email: values.email }).unwrap();
      if (result.success) {
        toast.success(
          result.data?.message || "Password reset link sent to your email!",
        );
        form.resetFields();
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to send reset email. Please try again.",
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Outside of Card */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Logo className="mb-10 scale-120" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2 transition-colors">
          Forgot Password?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base px-2 transition-colors">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-8 sm:p-10 mb-8 mt-2 transition-colors">
        {/* Form */}
        <Form
          form={form}
          name="forgotPasswordForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{
            email: "",
          }}
        >
          {/* Email Field */}
          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">
                Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              placeholder="admin@gmail.com"
              className="h-12 rounded-xl border-gray-200 dark:border-[#303030] dark:bg-[#1f1f1f] dark:text-white hover:border-[#272877] dark:hover:border-[#6e6fe4] focus:border-[#272877] transition-colors"
              prefix={
                <MailOutlined className="text-gray-400 dark:text-gray-500 mr-2" />
              }
            />
          </Form.Item>

          {/* Reset Password Button */}
          <Form.Item className="!mb-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              className="h-12 rounded-xl !bg-[#272877] !border-none font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Send Reset Link
            </Button>
          </Form.Item>

          {/* Back to Login Link */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#272877] dark:hover:text-[#6e6fe4] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeftOutlined className="text-xs" /> Back to Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
