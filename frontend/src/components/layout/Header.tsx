import Image from "next/image";
import Link from "next/link";
import { FinanceModeToggle } from "./FinanceModeToggle.tsx";
import { NaviMenu } from "./NaviMenu.tsx";
import { UserModeToggle } from "./UserModeToggle.tsx";
import { useAuth } from "@/contexts/AuthContext.tsx";

interface HeaderProps {
  finance: string;
  setFinance: (finance: string) => void;
}

export function Header({ finance, setFinance }: HeaderProps) {
  const { isLoading, isAuth, user } = useAuth();
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
              {/* 改善：userはappsettingscontextで管理する */}
              <UserModeToggle user="alone" setUser={() => {}} />
              <FinanceModeToggle finance={finance} setFinance={setFinance} />
              <NaviMenu />
            </div>
          ) : null)}
      </div>
    </header>
  );
}
