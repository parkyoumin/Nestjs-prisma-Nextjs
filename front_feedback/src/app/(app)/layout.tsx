import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Feedback Central",
  description: "Collect user feedback in one place",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
