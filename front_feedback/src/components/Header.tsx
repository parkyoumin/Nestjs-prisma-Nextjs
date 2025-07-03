"use client";

import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";

const Header = () => {
  const { user, logout, withdraw } = useAuthStore();
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleConfirmWithdraw = async () => {
    try {
      await withdraw();
      router.push("/");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      closeModal();
    }
  };

  const handleOpenWithdrawModal = () => {
    openModal(<WithdrawConfirm onConfirm={handleConfirmWithdraw} />);
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
                  className="block w-full px-2 py-1.5 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
                <button
                  onClick={handleOpenWithdrawModal}
                  className="block w-full px-2 py-1.5 text-left text-red-600 hover:bg-gray-100"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ) : (
            <PrimaryButton
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
              className="!w-auto !px-4 !py-2"
            >
              Get started
            </PrimaryButton>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Modal Content Component ---
const WithdrawConfirm = ({ onConfirm }: { onConfirm: () => void }) => {
  const { closeModal } = useModal();
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Confirm Withdrawal</h2>
      <p className="text-gray-600">
        Are you sure you want to withdraw? This action cannot be undone.
      </p>
      <div className="flex justify-center space-x-4 pt-4">
        <PrimaryButton onClick={closeModal} variant="grey">
          Cancel
        </PrimaryButton>
        <PrimaryButton onClick={onConfirm} variant="danger">
          Withdraw
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Header;
