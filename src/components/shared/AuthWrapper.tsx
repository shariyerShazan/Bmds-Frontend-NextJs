"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { Skeleton, Button, Result } from "antd";
import { LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/api/authApi"; // Logout mutation import korun

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useGetMeQuery();
  const [logout] = useLogoutMutation(); // Logout mutation hook
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Backend theke cookie clear kora (logout endpoint call)
      await logout(undefined).unwrap();
      window.location.href = "/auth/login";
    } catch (error) {
      // Error holeo login page e pathiye deya safe
      window.location.href = "/auth/login";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-10 bg-white dark:bg-[#001529]">
        <div className="w-full max-w-2xl">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (user?.data?.status === "BLOCKED") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-slate-800">
          <Result
            status="error"
            icon={<LockOutlined className="text-red-500 text-6xl" />}
            title={
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Account Blocked
              </span>
            }
            subTitle={
              <div className="text-gray-600 dark:text-gray-400">
                Your account has been restricted by the administrator.
              </div>
            }
            extra={[
              <Button
                key="login"
                type="primary"
                danger
                size="large"
                icon={<LogoutOutlined />}
                onClick={handleLogout} // Updated click handler
                className="w-full rounded-lg h-12 font-semibold"
              >
                Logout and Return to Login
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
