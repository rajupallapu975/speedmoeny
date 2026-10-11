import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { Layers, X, LayoutDashboard } from "lucide-react";
import { adminScreens } from "./screens/admin";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Screen not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This admin screen does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/admin/$screen"
            params={{ screen: "dashboard" }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScreenSwitcher() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <aside aria-label="Prototype Screen Navigation" className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="flex max-h-[80vh] w-80 flex-col rounded-2xl border border-border bg-card p-4 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-navy">Admin Screens (21)</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-7 w-7 place-items-center rounded-lg hover:bg-muted text-muted-foreground hover:text-navy"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex-1 space-y-1 overflow-y-auto pr-1 text-xs">
            {Object.entries(adminScreens).map(([k, v]) => (
              <button
                key={k}
                onClick={() => {
                  nav({ to: "/admin/$screen", params: { screen: k } });
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-medium text-navy hover:bg-soft hover:text-primary transition"
              >
                <span>{v.t}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{k}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-3.5 py-2 text-xs font-bold text-navy shadow-lg backdrop-blur hover:bg-soft transition"
        >
          <Layers className="h-4 w-4 text-primary" />
          <span>All Screens</span>
        </button>
      )}
    </aside>
  );
}

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ScreenSwitcher />
    </QueryClientProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    const DashComp = adminScreens["dashboard"].c;
    return <DashComp />;
  },
});

const adminScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/$screen",
  component: function AdminScreen() {
    const { screen } = adminScreenRoute.useParams();
    const ScreenComp = adminScreens[screen]?.c;
    if (!ScreenComp) return <NotFound />;
    return <ScreenComp key={screen} />;
  },
});

const directScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$screen",
  component: function DirectScreen() {
    const { screen } = directScreenRoute.useParams();
    const ScreenComp = adminScreens[screen]?.c;
    if (!ScreenComp) return <NotFound />;
    return <ScreenComp key={screen} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, adminScreenRoute, directScreenRoute]);

export const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return <RouterProvider router={router} />;
}
