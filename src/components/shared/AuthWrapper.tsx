"use client";

import { useGetMeQuery, useLogoutMutation } from "@/redux/api/authApi";
import { Skeleton, Button, Result } from "antd";
import { LockOutlined, LogoutOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Logic: Auth page e thakle query skip korbo
  const isAuthPage = pathname.startsWith("/auth");

  const {
    data: apiUser,
    isLoading,
    isFetching,
    isError,
  } = useGetMeQuery(undefined, {
    // Auth page e thakle query pathabo na
    skip: isAuthPage,
  });

  const [userLogout] = useLogoutMutation();

  useEffect(() => {
    // Loading thakle kichu korbo na
    if (isLoading || isFetching) return;

    const haveUser = Boolean(apiUser?.data?.id);

    // 2. Jodi user login kora thake kintu login page e thake -> dashboard e pathao
    if (haveUser && isAuthPage) {
      router.replace("/dashboard");
    }

    // 3. Jodi user na thake (error hoy ba data nai) ebong auth page e na thake -> login e pathao
    if (!haveUser && !isAuthPage && !isLoading) {
      router.replace("/auth/login");
    }
  }, [isLoading, isFetching, apiUser, pathname, router, isAuthPage]);

  const handleLogout = async () => {
    try {
      await userLogout(undefined).unwrap();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Force reload to clear all states
      window.location.href = "/auth/login";
    }
  };

  // 4. Loading State handling (Sudhu private route er jonno loading dekhabo)
  if (!isAuthPage && (isLoading || isFetching)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-10">
        <div className="w-full max-w-2xl">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  // 5. Blocked User Logic
  if (apiUser?.data?.status === "BLOCKED" && !isAuthPage) {
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
