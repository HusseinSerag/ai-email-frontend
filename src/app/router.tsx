import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingSpinner } from '../components/ui/spinner'
import NotFound from './notFound'

const LoadUserLayout = lazy(
  () => import('../components/layouts/load-user.layout'),
)
const SignInPage = lazy(() => import('./routes/sign-in'))
const SignUpPage = lazy(() => import('./routes/sign-up'))
const Home = lazy(() => import('./routes/home'))
const ProtectedRoutes = lazy(
  () => import('../components/layouts/protected-route.layout'),
)
const Mail = lazy(() => import('./routes/mail'))
const ErrorPage = lazy(() => import('./routes/error'))

export default function Router() {
  return (
    <Suspense
      fallback={
        <LoadingSpinner outerClassName="h-full w-full flex items-center justify-center" />
      }
    >
      <Routes>
        <Route path="error" element={<ErrorPage />} />
        <Route element={<LoadUserLayout />}>
          <Route element={<Home />} path="/" />
          <Route element={<SignInPage />} path="/sign-in" />
          <Route element={<SignUpPage />} path="/sign-up" />

          <Route element={<ProtectedRoutes />}>
            <Route element={<Mail />} path="/mail" />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
