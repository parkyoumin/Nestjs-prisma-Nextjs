import { BarChart, List, MousePointerClick } from "lucide-react";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";

export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-32 md:grid-cols-[auto,1fr]">
            <div className="w-full md:w-[480px]">
              <Image
                src="/main-illustration.svg"
                alt="illustration"
                className="h-auto w-full"
                width={480}
                height={480}
              />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold leading-tight">
                Collect user feedback in one place.
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Feedback Central is the easiest way to gather feedback from your
                users, organize it, and turn it into actionable insights.
              </p>
              <PrimaryButton
                href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
                className="mt-8"
              >
                Get started
              </PrimaryButton>
            </div>
          </div>
        </section>

        {/* Product Screenshot Section */}
        <section className="pb-16 text-center md:pb-24">
          <div className="mx-auto max-w-7xl px-32">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-50 shadow-lg">
              <div className="flex h-10 items-center justify-between rounded-t-xl border-b bg-white px-4">
                <span className="font-semibold">Feedback</span>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <div className="h-[400px] p-6">
                <div className="mx-auto h-full w-2/3 animate-pulse space-y-4 rounded-md bg-white p-4 shadow-inner">
                  <div className="h-8 rounded bg-gray-200"></div>
                  <div className="h-24 rounded bg-gray-200"></div>
                  <div className="h-12 rounded bg-green-200"></div>
                  <div className="h-8 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* steps Section */}
        <section id="steps-section" className="bg-gray-50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-32 text-center">
            <h3 className="mt-2 text-4xl font-bold">
              Three steps to better products
            </h3>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Feedback Central streamlines the feedback process, from collection
              to action, helping you build products that users love.
            </p>
            <div className="mt-12 grid gap-8 text-left md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-block rounded-md bg-blue-100 p-3 text-blue-600">
                  <MousePointerClick size={24} />
                </div>
                <h4 className="text-xl font-bold">Collect feedback</h4>
                <p className="mt-2 text-gray-600">
                  Easily gather feedback from users through various channels,
                  including in-app widgets, email, and social media.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-block rounded-md bg-blue-100 p-3 text-blue-600">
                  <List size={24} />
                </div>
                <h4 className="text-xl font-bold">Organize and prioritize</h4>
                <p className="mt-2 text-gray-600">
                  Categorize and prioritize feedback based on user impact,
                  frequency, and alignment with your product goals.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-4 inline-block rounded-md bg-blue-100 p-3 text-blue-600">
                  <BarChart size={24} />
                </div>
                <h4 className="text-xl font-bold">Analyze and act</h4>
                <p className="mt-2 text-gray-600">
                  Identify trends, pain points, and areas for improvement with
                  built-in analytics and reporting tools.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-32 py-8 md:flex-row">
          <div className="space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Contact Us
            </a>
          </div>
          <p className="mt-4 text-gray-500 md:mt-0">
            &copy; 2023 Feedback Central. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
