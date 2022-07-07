import Link from "next/link";

const Header = () => (
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
      <Link href="/signup">
        <a className="btn">Sign In</a>
      </Link>
    </div>
  </header>
);

export default Header;
