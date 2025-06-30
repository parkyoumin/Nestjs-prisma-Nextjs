"use client";

import { logout } from "@/services/userService";
import { InteractiveButton } from "./InteractiveButton";

export default function LogoutButton() {
  return (
    <InteractiveButton
      onClick={logout}
      className="rounded-lg bg-primary px-4 py-2 font-semibold text-black hover:bg-primary/80"
    >
      logout
    </InteractiveButton>
  );
}
