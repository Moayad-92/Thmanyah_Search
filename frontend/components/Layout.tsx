import React from "react";
import { Rocket, List } from "lucide-react";
import { planet } from "@lucide/lab";
import { Icon } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex bg-[#161727] min-h-screen text-left">
      <aside className="w-60 bg-[#161727] text-white p-6 space-y-6 border-r border-gray-500 hidden md:block">
        <div className="text-2xl font-bold">🎧 Thmanyah </div>

        <nav className="flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 transform hover:bg-black/20 hover:shadow-md hover:scale-[1.03]"
          >
            <Icon iconNode={planet} className="w-5 h-5" />
            <span>Home</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 transform hover:bg-black/20 hover:shadow-md hover:scale-[1.03]"
          >
            <Rocket className="w-5 h-5" />
            <span>Discover</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 transform hover:bg-black/20 hover:shadow-md hover:scale-[1.03]"
          >
            <List className="w-5 h-5" />
            <span>My Queue</span>
          </a>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
