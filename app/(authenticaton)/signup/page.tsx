"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { signUp } from "@/app/actions/action";

export default function SignUp() {
  const [state, formAction] = useActionState(signUp, {
    success: false,
    errors: {},
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter your first name"
          />
          {state.errors?.firstName && (
            <p className="text-sm text-red-500">{state.errors.firstName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter your last name"
          />
          {state.errors?.lastName && (
            <p className="text-sm text-red-500">{state.errors.lastName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            type="text"
            name="middleName"
            id="middleName"
            placeholder="Enter your middle name"
          />
          {state.errors?.middleName && (
            <p className="text-sm text-red-500">{state.errors.middleName}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
          {state.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
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

        <Button type="submit" className="w-full mt-4">
          Sign Up
        </Button>
      </form>
    </div>
  );
}
