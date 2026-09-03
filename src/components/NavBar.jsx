import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setUsername(null);
    window.location.href = "/signIn";
  };

  const navLinkClass =
    "relative text-lg tracking-wide text-ink/80 transition-colors hover:text-ink after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-lagoon after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-ink/10 bg-sand-light/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/images/logo.png" alt="" className="h-9 w-9 rounded-full" />
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Ala·Eh·scape
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          <Link to="/about" className={navLinkClass}>
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center">
          {username && role !== "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-lg font-medium text-ink shadow-xs transition-colors hover:border-lagoon">
                Hi, {username}
                <ChevronDown className="size-3.5 text-ink/60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/myBooking">My Booking</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/signIn"
              className="rounded-full bg-lagoon px-5 py-2 text-lg font-medium text-sand-light transition-colors hover:bg-lagoon-dark"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-ink"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-ink/10 bg-sand-light transition-[max-height] duration-300 ease-in-out",
          mobileOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-lg text-ink hover:bg-sand"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-md px-3 py-2 text-lg text-ink hover:bg-sand"
          >
            About
          </Link>
          {username && role !== "admin" ? (
            <>
              <div className="my-1 h-px bg-ink/10" />
              <Link
                to="/profile"
                className="rounded-md px-3 py-2 text-lg text-ink hover:bg-sand"
              >
                My Profile
              </Link>
              <Link
                to="/myBooking"
                className="rounded-md px-3 py-2 text-lg text-ink hover:bg-sand"
              >
                My Booking
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-left text-lg text-seal hover:bg-sand"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signIn"
              className="mt-1 rounded-full bg-lagoon px-4 py-2 text-center text-lg font-medium text-sand-light"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
