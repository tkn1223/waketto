"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext.tsx";
import { useViewMode } from "@/contexts/ViewModeContext.tsx";
import { FinanceModeToggle } from "./FinanceModeToggle.tsx";
import { NaviMenu } from "./NaviMenu.tsx";
import { UserModeToggle } from "./UserModeToggle.tsx";

// ダッシュボードのみヘッダーを表示
const path = ["dashboard", "budget-setting"];

export function Header() {
  const pathname = usePathname();
  const { isLoading, isAuth } = useAuth();
  const { finance, setFinance, user, setUser } = useViewMode();

  return (
    <header className="max-w-screen-x1 bg-emerald-100">
      <div className="flex items-center justify-between h-14 px-5">
        <Link aria-label="Home" href={"/dashboard"}>
          <Image
            className="dark:invert"
            src="/waketto.svg"
            alt="支出わけっと ロゴ"
            width={120}
            height={20}
            priority
          />
        </Link>

        {!isLoading &&
          (isAuth ? (
            <div className="flex items-center justify-between space-x-3">
              {path.includes(pathname.split("/")[1]) ? (
                <>
                  <UserModeToggle user={user} setUser={setUser} />
                  <FinanceModeToggle
                    finance={finance}
                    setFinance={setFinance}
                  />
                </>
              ) : null}
              <NaviMenu />
            </div>
          ) : null)}
      </div>
    </header>
  );
}
