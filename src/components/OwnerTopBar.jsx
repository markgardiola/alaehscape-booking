import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const OwnerTopBar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Owner";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/owner/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink/10 bg-white px-6">
      <span className="font-display text-lg font-semibold text-ink">
        Owner Portal
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink shadow-xs transition-colors hover:border-lagoon">
          Welcome, {username}
          <ChevronDown className="size-3.5 text-ink/60" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default OwnerTopBar;
