import { Outlet } from "react-router";

import Navbar from "@/components/layout/Navbar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;