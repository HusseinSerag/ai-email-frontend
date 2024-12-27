import OnlineStatus from '@/components/ui/OnlineStatus'

import { Toaster } from '@/components/ui/toaster'
import { MainErrorFallback } from '@/error/MainErrorFallback'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { ClerkProvider } from '@clerk/clerk-react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'
import { Bounce, ToastContainer } from 'react-toastify'

import { ThemeProvider } from '../context/themeProvider'

import Kbar from '../features/kbar'
import Router from './router'
import '@cyntler/react-doc-viewer/dist/index.css'

const queryClient = new QueryClient()
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function Provider() {
  const navigate = useNavigate()
  const isOnline = useNetworkStatus()

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <OnlineStatus />
      {isOnline && (
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
          <ReactQueryDevtools initialIsOpen={false} position="top" />
        </QueryClientProvider>
      )}
      {!isOnline && (
        <div className="w-full flex items-center justify-center h-full">
          Network error, please connect to internet!
        </div>
      )}
    </ErrorBoundary>
  )
}

function Component() {
  return (
    <ThemeProvider>
      <Kbar>
        <Router />
      </Kbar>
      <ToastContainer
        closeOnClick
        pauseOnFocusLoss={false}
        draggable={true}
        autoClose={2000}
        position="bottom-left"
        transition={Bounce}
        toastClassName="dark:bg-black dark:text-gray-200"
        stacked={false}
        limit={5}
      />
    </ThemeProvider>
  )
}
