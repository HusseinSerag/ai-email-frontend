import type { BadgeProps } from '@/components/ui/badge'

export function getBadgeVariantFromLabel(label: string): BadgeProps['variant'] {
  if ('work'.includes(label.toLowerCase())) {
    return 'default'
  }
  else {
    return 'secondary'
  }
}
