import { ClerkProvider } from '@clerk/clerk-react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useNavigate } from 'react-router-dom'
import { Toaster } from '../components/ui/toaster'
import { ThemeProvider } from '../context/themeProvider'
import { useSetTitle } from '../hooks/useSetTitle'

import Kbar from '../lib/kbar'

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
        <Router />
      </Kbar>
    </ThemeProvider>
  )
}
