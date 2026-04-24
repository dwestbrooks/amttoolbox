import { Metadata } from 'next'
import WeightBalanceTool from './WeightBalanceTool'

export const metadata: Metadata = {
  title: 'Weight & Balance Moment Calculator',
  description: 'Calculate weight, moment, and CG location for aircraft weight and balance calculations. Add multiple items with weight and arm station.',
}

export default function Page() {
  return <WeightBalanceTool />
}
