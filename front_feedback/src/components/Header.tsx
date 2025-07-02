"use client";

import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="text-xl font-bold">
          <img src="/logo.svg" alt="logo" className="h-16" />
        </Link>

        <div className="flex items-center space-x-8">
          {user ? (
            <div className="group relative">
              <button className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 origin-top-right scale-95 transform-gpu rounded-md bg-white p-2 text-sm shadow-lg opacity-0 transition-all duration-200 ease-in-out group-hover:scale-100 group-hover:opacity-100">
                <p className="px-2 py-1.5 font-semibold">{user.email}</p>
                <div className="my-1 h-px bg-gray-100" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-2 py-1.5 text-left text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <PrimaryButton href={loginUrl} className="!w-auto !px-4 !py-2">
              Get started
            </PrimaryButton>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
