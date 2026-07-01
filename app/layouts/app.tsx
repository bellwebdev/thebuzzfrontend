import { Outlet } from "react-router";

import { Nav } from "~/components/Nav/Nav";
import { ToastProvider } from "~/components/Toast/Toast";

export default function AppLayout() {
  return (
    <ToastProvider>
      <Nav />
      <Outlet />
    </ToastProvider>
  );
}
