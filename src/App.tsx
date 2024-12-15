import { ClerkProvider } from '@clerk/clerk-react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from './context/themeProvider'
import { useSetTitle } from './hooks/useSetTitle'
import LoadUserLayout from './layouts/load-user.layout'
import ProtectedRoutes from './layouts/protected-route.layout'
import Kbar from './lib/kbar'
import ErrorPage from './pages/error'
import Home from './pages/home'
import Mail from './pages/mail'
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'
import '@cyntler/react-doc-viewer/dist/index.css'

const queryClient = new QueryClient()
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function App() {
  const navigate = useNavigate()

  // return <DocumentViewer />;
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        routerPush={to => navigate(to)}
        routerReplace={to => navigate(to, { replace: true })}
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
      >
        <Component />
      </ClerkProvider>
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

function Component() {
  useSetTitle()
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
  )
}
