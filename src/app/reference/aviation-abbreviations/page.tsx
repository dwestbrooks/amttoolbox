import { Metadata } from 'next'
import AviationAbbreviationsClient from './AviationAbbreviationsClient'

export const metadata: Metadata = {
  title: 'Aviation Maintenance Abbreviations & Acronyms',
  description: 'Searchable A-Z reference of 150+ aviation maintenance abbreviations and acronyms. AD, MEL, SB, CDL, STC, MRO, NDT, and more.',
}

export default function Page() {
  return <AviationAbbreviationsClient />
}
