import { Button } from '@/components/ui/button'
import { useCheckoutSession } from '../api/useCheckoutSession'

export default function StripeButton() {
  const { getCheckoutUrl } = useCheckoutSession()
  return <Button onClick={getCheckoutUrl}> upgrade!</Button>
}
