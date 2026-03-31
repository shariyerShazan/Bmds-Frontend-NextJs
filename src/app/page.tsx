"use client"
import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function RootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // refetch extract kora hoyeche
  const { data: user, isLoading, refetch } = useGetMeQuery();
   console.log(user, "-");
   console.log("okk")
  useEffect(() => {
    // Route mount hole ba change hole data refresh korbe
    refetch();
  }, [refetch]);

useEffect(() => {
  if (!isLoading) {
    // User na thakle ba status blocked hole login e pathabe
    const isBlocked =
      user?.data?.status === "BLOCKED" ;
    const noUser = !user;

    if (noUser || isBlocked) {
      toast.error(
        noUser ? "You are not logged in!" : "Your account is blocked!",
      );

      const timer = setTimeout(() => {
        router.replace("/auth/login");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Shob thik thakle dashboard
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
