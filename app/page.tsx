"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { logIn } from "@/app/actions/action";
import { useEffect } from "react";
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
  });
  return (
    <div className="w-screen h-screen flex justify-center items-center shadow-2xl bg-gray-100">
      <div className="form-container min-w-5xl h-[700px] border rounded-2xl overflow-clip p-4 flex flec-col bg-white">
        <form
          action={formAction}
          className="space-y-4 bg-white w-[50%] p-3 flex items-center  justify-center flex-col"
        >
          <div className="greet w-[80%]">
            <h1 className="text-2xl font-semibold">Welcome Back,</h1>
            <p className="text-gray-500 text-sm">please enter your details</p>
          </div>
          <div className="space-y-1 w-[80%]">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="min-w-full"
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email}</p>
            )}
          </div>

          <div className="space-y-1 w-[80%]">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
            />
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-[80%] mt-4">
            Log in
          </Button>
        </form>
        <div
          className="w-[50%] rounded-2xl"
          style={{
            backgroundImage: `url(/login-bg.jpg)`,
            backgroundSize: "cover",
          }}
        >
          s
        </div>
      </div>
    </div>
  );
}
