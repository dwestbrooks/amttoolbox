import { Metadata } from 'next'
import ANHardwareDecoderTool from './ANHardwareDecoderTool'

export const metadata: Metadata = {
  title: 'AN Hardware Decoder',
  description: 'Decode AN and MS aircraft hardware part numbers. Understand bolt sizes, nut types, and washer specifications instantly.',
}

export default function Page() {
  return <ANHardwareDecoderTool />
}
