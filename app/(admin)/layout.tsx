"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Nav from "@/components/ui/nav";
import { ReactNode } from "react";

const SECRET = process.env.SECRET_KEY;

export default async function Layout({ children }: { children: ReactNode }) {
  const cookie = await cookies();
  const token = cookie.get("jwt")?.value;

  if (!token) redirect("/login");

  try {
    const decoded: any = jwt.verify(token, SECRET as string);

    if (decoded.role !== "admin") redirect("/login");

    return (
      <div className="bg-gray-300 flex w-screen h-screen">
        <Nav adminName={`${decoded.firstName} ${decoded.lastName}`} />
        <div className="flex-grow bg-white p-3 overflow-y-scroll">
          {children}
        </div>
      </div>
    );
  } catch (error) {
    console.error("JWT Verification failed: ", error);
    redirect("/login");
  }
}
