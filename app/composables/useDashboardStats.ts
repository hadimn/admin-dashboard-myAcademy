// composables/useDashboardStats.ts
export interface StatItem {
  id: string
  name: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: string
}

export const useDashboardStats = () => {
  const stats = ref<StatItem[]>([
    {
      id: '1',
      name: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'increase',
      icon: 'i-heroicons-currency-dollar'
    },
    {
      id: '2',
      name: 'Subscriptions',
      value: '+2350',
      change: '+180.1%',
      changeType: 'increase',
      icon: 'i-heroicons-users'
    },
    {
      id: '3',
      name: 'Sales',
      value: '+12,234',
      change: '+19%',
      changeType: 'increase',
      icon: 'i-heroicons-shopping-cart'
    },
    {
      id: '4',
      name: 'Active Now',
      value: '+573',
      change: '-201',
      changeType: 'decrease',
      icon: 'i-heroicons-clock'
    }
  ])

  return { stats }
}