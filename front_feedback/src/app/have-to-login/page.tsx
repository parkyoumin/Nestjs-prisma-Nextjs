import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";

const HaveToLoginPage = () => {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;

  return (
    <main className="flex h-full flex-col items-center justify-center bg-zinc-50/90">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-10 flex h-48 w-80 items-center justify-center">
          <Image
            src="/have-to-login-illustration.svg"
            alt="A person standing in front of a giant lock, illuminated by a spotlight."
            width={400}
            height={400}
            priority
          />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          You need to log in to view this page
        </h1>
        <p className="mb-8 text-gray-500">Please log in to continue.</p>

        <PrimaryButton href={loginUrl} className="!w-auto">
          Log in
        </PrimaryButton>
      </div>
    </main>
  );
};

export default HaveToLoginPage;
