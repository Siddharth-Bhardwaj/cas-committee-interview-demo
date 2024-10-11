"use client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session } = useSession();

  const login = () => {
    setLoading(true);
    signIn("NYU_OAuth2", { redirect: false });
  };

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);

  return (
    <div className="w-full h-screen flex items-center justify-center px-4 bg-nyu-nv">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button
            disabled={loading}
            onClick={() => login()}
            className="w-full bg-nyu-nv"
          >
            {loading ? <LoadingSpinner /> : "Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
