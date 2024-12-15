import { Button } from '@/components/ui/button'
import { SignOutButton, useAuth } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { getToken } = useAuth()

  async function clk() {
    const token = await getToken()
    const res = await fetch(`http://localhost:3000/api/email/auth/url`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()

    window.location.href = data.data
  }
  return (
    <>
      <div className="flex gap-2">
        <Button onClick={clk}>click me</Button>
        <SignOutButton />
        <Link to="/sign-in">sign in</Link>
      </div>
    </>
  )
}
