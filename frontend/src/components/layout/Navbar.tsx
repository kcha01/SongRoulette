import {NavLink} from "react-router";

function Navbar() {
    return (
    <header className="border-b">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <NavLink to="/" className="text-xl font-bold">
          🎵 SongRoulette
        </NavLink>

        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium text-primary"
                : "text-sm font-medium text-muted-foreground hover:text-primary"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-medium text-primary"
                : "text-sm font-medium text-muted-foreground hover:text-primary"
            }
          >
            Login
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
