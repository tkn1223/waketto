import Image from "next/image";
import Link from "next/link";
import { FinanceModeToggle } from "./FinanceModeToggle.tsx";
import { NaviMenu } from "./NaviMenu.tsx";
import { UserModeToggle } from "./UserModeToggle.tsx";

interface HeaderProps {
  isLoading: boolean;
  user: string;
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  setUser: (user: string) => void;
  finance: string;
  setFinance: (finance: string) => void;
}

export function Header({
  isLoading,
  user,
  isAuth,
  setIsAuth,
  setUser,
  finance,
  setFinance,
}: HeaderProps) {
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
              <UserModeToggle user={user} setUser={setUser} />
              <FinanceModeToggle finance={finance} setFinance={setFinance} />
              <NaviMenu setIsAuth={setIsAuth} />
            </div>
          ) : null)}
      </div>
    </header>
  );
}
