"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getUser } from "../../services/userService";

export default function LoginSuccessPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        console.log(res);

        setUser({ id: res.data.id, email: res.data.email });
        // router.replace("/dashboard");
      } catch (e) {
        console.error(e);
        // router.replace("/");
      }
    };

    fetchUser();
  }, []);

  return <p>Logging you in...</p>;
}
