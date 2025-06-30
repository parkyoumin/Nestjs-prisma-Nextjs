"use client";

import { useAuthStore } from "@/store/auth";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  console.log(user);

  return <div>Dashboard</div>;
}
