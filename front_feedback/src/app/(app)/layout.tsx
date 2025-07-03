import Header from "@/components/Header";

export const metadata = {
  title: "Feedback",
  description: "Feedback service",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
