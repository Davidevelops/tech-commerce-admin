"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { logIn } from "@/app/actions/action";
import { useRouter } from "next/navigation";

export default function logInPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(logIn, {
    success: false,
    errors: {},
  });

  useEffect(() => {
    if (state?.success && state.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-3xl border rounded-2xl shadow-xl bg-white overflow-hidden p-6">
        <form
          action={formAction}
          className="space-y-4 w-full flex flex-col items-center justify-center"
        >
          <div className="w-full">
            <h1 className="text-2xl font-semibold">Welcome Back,</h1>
            <p className="text-gray-500 text-sm">Please enter your details</p>
          </div>

          <div className="space-y-1 w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full"
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email}</p>
            )}
          </div>

          <div className="space-y-1 w-full">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full"
            />
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-4">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}
