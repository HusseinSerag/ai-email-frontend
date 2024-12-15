import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <SignIn forceRedirectUrl="/mail" />
    </div>
  )
}
