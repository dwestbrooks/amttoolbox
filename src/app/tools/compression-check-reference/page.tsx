import { Metadata } from 'next'
import CompressionCheckTool from './CompressionCheckTool'

export const metadata: Metadata = {
  title: 'Engine Compression Check Reference',
  description: 'Differential compression check interpretation guide for Continental and Lycoming aircraft engines. Understand what your readings mean.',
}

export default function Page() {
  return <CompressionCheckTool />
}
