"use client";

import Logo from "@/components/shared/Logo";
import { getBaseUrl } from "@/lib/base_url";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SetNewPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function SetNewPasswordForm() {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword] = useResetPasswordMutation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SetNewPasswordFormData) => {
    if (!token) {
      toast.error(
        "Invalid or missing reset token. Please request a new reset link.",
      );
      return;
    }

    setLoading(true);
    try {
      // Step 1: Use the token to call get-me and retrieve user ID
      const baseUrl = getBaseUrl();
      const meRes = await fetch(`${baseUrl}/auth/get-me`, {
        credentials: "include",
        headers: {
          // 'ngrok-skip-browser-warning': 'true',
          Authorization: token,
        },
      });
      const meJson = await meRes.json();

      if (!meJson.success || !meJson.data?.id) {
        toast.error(
          "Invalid or expired reset token. Please request a new reset link.",
        );
        setLoading(false);
        return;
      }

      // Step 2: Reset the password using the user ID
      const result = await resetPassword({
        id: meJson.data.id,
        password: values.password,
        token,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Password updated successfully!");
        router.push("/auth/login");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(
        err?.data?.message || "Failed to update password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Outside of Card */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Logo className="mb-10 scale-120" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2 transition-colors">
          Set New Password
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base px-2 transition-colors">
          Please create a strong password to secure your account.
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-8 sm:p-10 mb-8 mt-2 transition-colors">
        {/* Form */}
        <Form
          form={form}
          name="setNewPasswordForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
        >
          {/* Password Field */}
          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">
                Password
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              placeholder="••••••"
              className="h-12 rounded-xl border-gray-200 dark:border-[#303030] dark:bg-[#1f1f1f] dark:text-white hover:border-[#272877] dark:hover:border-[#6e6fe4] focus:border-[#272877] transition-colors"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone />
                ) : (
                  <EyeInvisibleOutlined className="dark:text-gray-500" />
                )
              }
              prefix={
                <LockOutlined className="text-gray-400 dark:text-gray-500 mr-2" />
              }
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label={
              <span className="text-gray-700 dark:text-gray-300 font-medium transition-colors">
                Confirm Password
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
            className="!mb-6"
          >
            <Input.Password
              placeholder="••••••"
              className="h-12 rounded-xl border-gray-200 dark:border-[#303030] dark:bg-[#1f1f1f] dark:text-white hover:border-[#272877] dark:hover:border-[#6e6fe4] focus:border-[#272877] transition-colors"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone />
                ) : (
                  <EyeInvisibleOutlined className="dark:text-gray-500" />
                )
              }
              prefix={
                <LockOutlined className="text-gray-400 dark:text-gray-500 mr-2" />
              }
            />
          </Form.Item>

          {/* Continue Button */}
          <Form.Item className="!mb-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-12 rounded-xl !bg-[#272877] !border-none font-semibold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Reset Password
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
