"use client";

import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";
import { Skeleton, Button, Result } from "antd";
import { LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/redux/store";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: apiUser,
    isLoading,
    isFetching,
  } = useGetMeQuery(undefined, {
    skip: false,
  });
  const [logout] = useLogoutMutation();
  const pathname = usePathname();
  const router = useRouter();

  // const auth = useSelector((state: RootState) => state.auth);
  // const isLoggedIn = Boolean(auth.isAuthenticated || auth.accessToken);

  // ✅ Redirect logic: auth state wins, then API status
  useEffect(() => {
    if (isLoading || isFetching) return;

    const isAuthPage = pathname.startsWith("/auth");
    const haveUser = Boolean(apiUser?.data?.id);

    if (haveUser && isAuthPage) {
      router.replace("/dashboard");
      return;
    }

    if (!haveUser && !isAuthPage) {
      router.replace("/auth/login");
    }
  }, [isLoading, isFetching, apiUser, pathname, router]);

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
    } catch (error) {
    } finally {
      window.location.href = "/auth/login";
    }
  };

  // 🔄 Loading UI
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen p-10">
        <div className="w-full max-w-2xl">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  // 🚫 Blocked user
  if (apiUser?.data?.status === "BLOCKED") {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full shadow-2xl rounded-2xl p-8">
          <Result
            status="error"
            icon={<LockOutlined />}
            title="Account Blocked"
            subTitle="Your account has been restricted by the administrator."
            extra={[
              <Button
                key="logout"
                type="primary"
                danger
                size="large"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="w-full"
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
