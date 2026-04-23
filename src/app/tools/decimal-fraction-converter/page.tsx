import { Metadata } from 'next'
import DecimalFractionTool from './DecimalFractionTool'

export const metadata: Metadata = {
  title: 'Decimal Fraction Converter & Drill Size Chart',
  description: 'Convert between fractional inches, decimal inches, and millimeters. Complete drill size reference table with wire gauge, letter, and fractional sizes.',
}

export default function Page() {
  return <DecimalFractionTool />
}
