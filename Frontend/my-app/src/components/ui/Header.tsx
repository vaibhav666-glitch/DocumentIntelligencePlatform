"use client";

import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{
        background: "rgba(9,10,16,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: "#6366f1",
              boxShadow: "0 0 8px rgba(99,102,241,0.8)",
            }}
          />
          <span
            className="text-2xl font-semibold tracking-tight transition-opacity group-hover:opacity-70"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            DocMind
          </span>
          <span
            className="text-sm font-medium uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "0.5px solid rgba(99,102,241,0.3)",
              color: "rgba(99,102,241,0.9)",
            }}
          >
            Beta
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">

          {/* Dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xl transition-all"
            style={{ color: "#fff" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
            }}
          >
            <LayoutDashboard size={13} />
            Dashboard
          </button>

          {/* Sign out */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xl transition-all"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "0.5px solid rgba(239,68,68,0.25)",
              color: "rgba(239,68,68,0.8)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.25)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(239,68,68,0.8)";
            }}
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;