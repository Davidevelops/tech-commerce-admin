"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import {
  LayoutDashboard,
  SquareChartGantt,
  ShoppingBasket,
  Settings,
  LogOut,
} from "lucide-react";
import { logOut } from "@/app/actions/action";
import { useRouter } from "next/navigation";
export default function Nav({ adminName }: { adminName: string }) {
  const active = "bg-white text-black flex gap-2 p-1 rounded-l";
  const inactive = "text-black flex gap-2 p-1";
  const pathname = usePathname();
  const router = useRouter();
  async function handleLogout() {
    try {
      await logOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <aside>
      <h1 className="mx-3 my-4 text-xl font-bold">{adminName}</h1>
      <nav className="flex flex-col gap-3 p-3 pr-0 ">
        <Link
          href={"/orders"}
          className={pathname.includes("orders") ? active : inactive}
        >
          <SquareChartGantt />
          Orders
        </Link>
        <Link
          href={"/products"}
          className={pathname.includes("products") ? active : inactive}
        >
          <ShoppingBasket />
          Products
        </Link>

        <Link href={""} className={inactive} onClick={handleLogout}>
          <LogOut />
          Log Out
        </Link>
      </nav>
    </aside>
  );
}
