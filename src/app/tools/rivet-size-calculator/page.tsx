import { Metadata } from 'next'
import RivetSizeTool from './RivetSizeTool'

export const metadata: Metadata = {
  title: 'Rivet Size Calculator',
  description: 'Calculate recommended rivet diameter, edge distance, pitch, and grip length for aircraft sheet metal repairs.',
}

export default function Page() {
  return <RivetSizeTool />
}
