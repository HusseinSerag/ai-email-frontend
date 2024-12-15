import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mt-52 h-full flex flex-col items-center font-semibold">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" replace>
        Go to Home
      </Link>
    </div>
  )
}
