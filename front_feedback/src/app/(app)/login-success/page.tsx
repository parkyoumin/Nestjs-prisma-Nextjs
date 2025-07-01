"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getUser } from "@/services/userService";
import { Loader2 } from "lucide-react";

export default function LoginSuccessPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();

        setUser({ id: res.data.id, email: res.data.email });
        router.replace("/dashboard");
      } catch (e) {
        console.error(e);
        router.replace("/");
      }
    };

    fetchUser();
  }, [router, setUser]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      <Loader2 className="h-12 w-12 animate-spin text-white" />
    </div>
  );
}
