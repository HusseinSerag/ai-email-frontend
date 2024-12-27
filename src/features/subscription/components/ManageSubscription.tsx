import useInteraction from '@/api/interactions/useInteractions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FREE_CREDITS_PER_DAY } from '@/lib/globals'
import { atom, useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { useCheckoutSession } from '../api/useCheckoutSession'
import { useGetSubscription } from '../api/useGetSubscription'
import TimeLeftForRecharge from './timeLeftForRecharge'

export const subscriptionAtom = atom(false)
export default function Subscription() {
  const { getCheckoutUrl, isLoading } = useCheckoutSession()
  const [subscription, setSubscription] = useAtom(subscriptionAtom)
  const { data } = useGetSubscription()
  const interaction = useInteraction()
  const isSubscribed = data
  const remainingCredit = interaction?.count

  return (
    <Dialog open={subscription} onOpenChange={setSubscription}>
      <DialogTrigger>
        <Button size="sm" className="w-full" variant="outline">
          Manage subscription
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white w-[95%]  dark:bg-gray-900">
        <div>
          <div className=" relative overflow-hidden flex flex-col md:flex-row gap-4">
            <img
              src="/bot.webp"
              className="absolute -bottom-6 -right-10 h-[180px] w-auto"
            />
            <div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-bold">
                  {isSubscribed ? 'Premium' : 'Free'}
                  {' '}
                  Plan
                </div>

                {!isSubscribed && (
                  <div className="text-sm font-semibold  text-gray-800 md:max-w-full dark:text-gray-400">
                    {remainingCredit ?? 0}
                    {' '}
                    /
                    {FREE_CREDITS_PER_DAY}
                    {' '}
                    credits left
                  </div>
                )}
              </div>
              <>
                {!isSubscribed && interaction && (
                  <TimeLeftForRecharge time={interaction.firstInteraction} />
                )}
                <div className="mt-2 mb-4 font-semibold text-gray-800 dark:text-gray-400 text-sm max-w-[calc(100%-150px)]">
                  {!isSubscribed
                    ? 'Upgrade to pro tier to ask as many questions as you like'
                    : 'You can ask as many questions as you want!'}
                </div>
                <div className="mt-2 mb-4 font-semibold text-gray-800 dark:text-gray-400 text-sm max-w-[calc(100%-150px)]">
                  {!isSubscribed ? 'Up to 3 accounts' : 'Unlimited accounts'}
                </div>
              </>

              <div className="">
                <Button onClick={getCheckoutUrl}>
                  {!isLoading
                    ? (
                        isSubscribed
                          ? (
                              'Manage susbscription'
                            )
                          : (
                              'Upgrade to Pro'
                            )
                      )
                    : (
                        <Loader2 className="animate-spin" />
                      )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
