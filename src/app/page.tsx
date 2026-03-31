import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { toast, Toaster } from "sonner";

export default function RootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { data: user, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.data.status === "BLOCKED") {
        toast.error(
          !user ? "You are not logged in!" : "Your account is blocked!",
        );
        setTimeout(() => {
          router.replace("/auth/login");
        }, 1000);
      } else {
        router.replace("/dashboard");
      }
      setLoading(false);
    }
  }, [isLoading, user, router]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting...</p>
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  return <Toaster position="top-right" richColors />;
}
