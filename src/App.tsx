import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ClerkProvider } from "@clerk/clerk-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import Home from "./pages/home";
import LoadUserLayout from "./layouts/load-user.layout";
import "@cyntler/react-doc-viewer/dist/index.css";
import Mail from "./pages/mail";
import ProtectedRoutes from "./layouts/protected-route.layout";
import { Toaster } from "./components/ui/toaster";
import ErrorPage from "./pages/error";
import { ThemeProvider } from "./context/themeProvider";
import Kbar from "./lib/kbar";
import { useSetTitle } from "./hooks/useSetTitle";
import DocumentViewer from "./components/ui/DocumentViewer";

const queryClient = new QueryClient();
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function App() {
  const navigate = useNavigate();

  // return <DocumentViewer />;
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        routerPush={(to) => navigate(to)}
        routerReplace={(to) => navigate(to, { replace: true })}
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
      >
        <Component />
      </ClerkProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function Component() {
  useSetTitle();
  return (
    <ThemeProvider>
      <Kbar>
        <Routes>
          <Route path="error" element={<ErrorPage />} />
          <Route element={<LoadUserLayout />}>
            <Route element={<SignInPage />} path="/sign-in" />
            <Route element={<SignUpPage />} path="/sign-up" />

            <Route element={<Home />} path="/" />
            <Route element={<ProtectedRoutes />}>
              <Route element={<Mail />} path="/mail" />
            </Route>
          </Route>
        </Routes>
      </Kbar>
    </ThemeProvider>
  );
}
