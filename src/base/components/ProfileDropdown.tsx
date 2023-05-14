import Link from "next/link";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

type ProfileDropdownProps = {
  session: Session;
};

const ProfileDropdown = ({ session }: ProfileDropdownProps) => {
  const handleLogout = () => {
    signOut();
  };

  const handleProfile = () => {};

  return (
    <div className="dropdown dropdown-end">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <label tabIndex={0} className="btn m-1">
        {session.user?.email}
      </label>
      <ul
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
      >
        <li>
          <Link href="/profile">
            <button>Profile</button>
          </Link>
        </li>
        <li>
          <Link href="/">
            <button onClick={handleLogout}>Logout</button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
