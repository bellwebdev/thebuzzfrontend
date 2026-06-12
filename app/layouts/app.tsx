import { Outlet } from "react-router";

import { Nav } from "~/components/Nav";
import { ToastProvider } from "~/components/Toast";

export default function AppLayout() {
  return (
    <ToastProvider>
      <Nav />
      <Outlet />
    </ToastProvider>
  );
}
