import Link from "next/link";
import { useSession } from "next-auth/react";

import ProfileDropdown from "@/base/components/ProfileDropdown";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="navbar bg-base-100 m-0">
      <div className="navbar-start">
        <label htmlFor="side-drawer" className="btn btn-primary drawer-button">
          x
        </label>
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">ManifestCTF</a>
        </Link>
      </div>
      <div className="navbar-end">
        {session ? (
          <ProfileDropdown session={session} />
        ) : (
          <Link href="/login">
            <a className="btn">Sign In</a>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
