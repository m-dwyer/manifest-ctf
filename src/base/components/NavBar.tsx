import { useSession } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: session } = useSession();

  return (
    <nav className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <ul>
        <li>
          <Link href="/challenges">
            <a>Challenges</a>
          </Link>
        </li>
        <li>
          {session?.user?.role === "ADMIN" && (
            <Link href="/challenges/admin">
              <a>Challenges Admin</a>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
