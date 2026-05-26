import { Metadata } from 'next'
import MSHardwareTool from './MSHardwareTool'

export const metadata: Metadata = {
  title: 'MS Hardware Decoder',
  description: 'Decode MS (Military Standard) aircraft hardware part numbers. Supports rivets, nuts, cotter pins, screws, washers, and tinnerman nuts.',
}

export default function Page() {
  return <MSHardwareTool />
}
