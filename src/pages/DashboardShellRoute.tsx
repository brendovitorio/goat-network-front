import { Outlet } from "react-router-dom";
import { DashboardShell } from "@/components/dashboard/shell";
import { useEffect } from "react";

export default function DashboardShellRoute() {
  useEffect(() => {
    document.title = "Dashboard — Goat Network";
  }, []);

  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
