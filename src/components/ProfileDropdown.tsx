import Link from "next/link";
import { useUser } from "@supabase/auth-helpers-react";

import { logout } from "@services/authentication";

const ProfileDropdown = () => {
  const { user } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dropdown dropdown-end">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <label tabIndex={0} className="btn m-1">
        {user?.email}
      </label>
      <ul
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52"
      >
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
