import StripeButton from './stripeButton'

export default function PremiumBanner() {
  const isSubscribed = false

  if (!isSubscribed) {
    return (
      <div className="bg-gray-800 relative p-4 rounded-lg border overflow-hidden flex flex-col md:flex-row gap-4">
        <div className="flex">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xl">Free tier</div>
            <div>you have 0 / 15 questions left for the next 22:03:23</div>
            <StripeButton />
          </div>
        </div>
      </div>
    )
  }
  return <div></div>
}
