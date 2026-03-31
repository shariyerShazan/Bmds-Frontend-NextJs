"use client";

import Logo from "@/components/shared/Logo";
import { getBaseUrl } from "@/lib/base_url";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type VerifyStatus = "loading" | "success" | "error";

export default function VerifyEmailChangeForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasCalledRef = useRef(false);

  const verifyEmail = useCallback(async () => {
    if (!token) {
      setStatus("error");
      setErrorMessage(
        "Invalid or missing verification token. Please request a new email change.",
      );
      return;
    }

    try {
      const baseUrl = getBaseUrl();
      const res = await fetch(`${baseUrl}/auth/reset-email`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: "",
      });
      const result = await res.json();

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Failed to verify email change.");
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Failed to verify email change. The link may have expired.",
      );
    }
  }, [token]);

  useEffect(() => {
    if (hasCalledRef.current) return;
    hasCalledRef.current = true;
    verifyEmail();
  }, [verifyEmail]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Logo className="mb-10 scale-120" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2 transition-colors">
          Email Verification
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-base px-2 transition-colors">
          Confirming your email address change
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/95 dark:bg-[#141414]/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-gray-100 dark:border-white/10 p-8 sm:p-10 mb-8 mt-2 transition-colors">
        {/* Loading State */}
        {status === "loading" && (
          <div className="text-center py-8">
            <LoadingOutlined className="text-5xl text-[#272877] dark:text-[#6e6fe4] mb-5" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
              Verifying your email change...
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Please wait while we confirm your new email address.
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="text-center py-8">
            <CheckCircleFilled className="text-5xl text-green-500 mb-5" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
              Email Updated Successfully!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">
              Your email has been changed. Please log in with your new email to
              continue.
            </p>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#272877] dark:text-[#6e6fe4] hover:underline transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeftOutlined className="text-xs" /> Go to Login
            </Link>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="text-center py-8">
            <CloseCircleFilled className="text-5xl text-red-500 mb-5" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
              Verification Failed
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 transition-colors">
              {errorMessage}
            </p>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#272877] dark:hover:text-[#6e6fe4] transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeftOutlined className="text-xs" /> Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
