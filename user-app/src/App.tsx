import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { customerScreens } from "./screens/customer";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Screen not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This customer screen does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/app/$screen"
            params={{ screen: "welcome" }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lift"
          >
            Go to Welcome
          </Link>
        </div>
      </div>
    </div>
  );
}

function RootLayout() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let lastBack = 0;

    const subPromise = CapApp.addListener("backButton", () => {
      const path = window.location.pathname;
      const isRootScreen =
        path === "/" ||
        path.includes("/welcome") ||
        path.includes("/home") ||
        path.endsWith("/app") ||
        path.endsWith("/app/");

      if (isRootScreen) {
        const now = Date.now();
        if (now - lastBack < 2000) {
          CapApp.exitApp();
        } else {
          lastBack = now;
        }
      } else {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          router.navigate({ to: "/app/$screen", params: { screen: "home" } });
        }
      }
    });

    return () => {
      subPromise.then((h) => h.remove());
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
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
    const SplashComp = customerScreens["splash"].c;
    return <SplashComp />;
  },
});

const appScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app/$screen",
  component: function AppScreen() {
    const { screen } = appScreenRoute.useParams();
    const ScreenComp = customerScreens[screen]?.c;
    if (!ScreenComp) return <NotFound />;
    return <ScreenComp key={screen} />;
  },
});

const directScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$screen",
  component: function DirectScreen() {
    const { screen } = directScreenRoute.useParams();
    const ScreenComp = customerScreens[screen]?.c;
    if (!ScreenComp) return <NotFound />;
    return <ScreenComp key={screen} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, appScreenRoute, directScreenRoute]);

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
