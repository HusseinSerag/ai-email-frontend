import { MainErrorFallback } from '@/error/MainErrorFallback'

import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'

import { useNavigate } from 'react-router-dom'

import { Bounce, ToastContainer } from 'react-toastify'
import { ThemeProvider } from '../context/themeProvider'
import Kbar from '../features/kbar'
import { useSetTitle } from '../hooks/useSetTitle'

import Router from './router'
import '@cyntler/react-doc-viewer/dist/index.css'

const queryClient = new QueryClient()
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function Provider() {
  const navigate = useNavigate()

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          routerPush={to => navigate(to)}
          routerReplace={to => navigate(to, { replace: true })}
          publishableKey={PUBLISHABLE_KEY}
          afterSignOutUrl="/"
        >
          <Component />
        </ClerkProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

function Component() {
  useSetTitle()

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
        toastClassName={"dark:bg-black dark:text-gray-200"}
        stacked={false}
        limit={5}
      />
    </ThemeProvider>
  )
}
