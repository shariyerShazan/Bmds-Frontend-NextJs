"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function RootPage() {
  const router = useRouter();
//   const { data: user, isLoading } = useGetMeQuery();
// console.log(user)
//   useEffect(() => {
//     if (!isLoading) {
//       const isBlocked = user?.data?.status === "BLOCKED";
//       const noUser = !user?.data;

//       if (noUser || isBlocked) {
//         toast.error(
//           noUser ? "You are not logged in!" : "Your account is blocked!",
//         );

//         setTimeout(() => {
//           router.replace("/auth/login");
//         }, 1000);
//       } else {
//         router.replace("/dashboard");
//       }
//     }
//   }, [isLoading, user, router]);

  // ⏳ Loading UI
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p>Redirecting...</p>
  //       <Toaster position="top-right" richColors />
  //     </div>
  //   );
  // }

  return <Toaster position="top-right" richColors />;
}
