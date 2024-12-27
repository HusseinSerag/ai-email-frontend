import { Button } from '@/components/ui/button'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const { isSignedIn } = useCustomAuth()
  return (
    <div className="h-full">
      <Button
        onClick={() => {
          if (isSignedIn) {
            navigate('/mail')
          }
          else {
            navigate('/sign-up')
          }
        }}
        size="sm"
        className="absolute shadow-lg border bg-gray-900 border-gray-800 text-gray-100 z-[10] top-4 right-4"
      >
        {isSignedIn ? 'Get started' : 'Go to Mail'}
      </Button>
      <div className="home-main p-2 pt-10  h-[40%] flex flex-col items-center justify-center">
        <h1 className="sm:text-4xl mb-10 text-3xl text-center font-semibold text-black dark:text-white">
          An AI-powered Email Client.
        </h1>
        <h2 className=" text-center">
          an email client that is powered by AI to help you manage your emails.
        </h2>
      </div>
      <div className="w-full py-10 flex items-center justify-center">
        <div className="w-[80%] lg:w-[70%] gap-4 flex-col items-center md:flex-row flex justify-between">
          <div className="border  shadow-lg rounded-lg p-4  max-w-[300px] border-lg">
            <div className="font-bold text-lg">AI-powered RAG</div>
            <div className="text-sm text-muted-foreground font-semibold">
              ask question to our chatbots to learn more about your emails
            </div>
          </div>
          <div className="border shadow-lg rounded-lg p-4  max-w-[300px] border-lg">
            <div className="font-bold text-lg">Keyboard First</div>
            <div className="text-sm text-muted-foreground font-semibold">
              navigate through your emails with just your keyboard
            </div>
          </div>
          <div className="border shadow-lg rounded-lg p-4  max-w-[300px] border-lg">
            <div className="font-bold text-lg">Full-text search</div>
            <div className="text-sm text-muted-foreground font-semibold">
              quickly search through your emails with our full text search
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center pb-10 justify-center">
        <div className="md:w-[60%] w-[90%]">
          <img src="/preview-img.png" />
        </div>
      </div>
    </div>
  )
}
