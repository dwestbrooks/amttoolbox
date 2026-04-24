import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExamPageClient from './ExamPageClient'

type ExamSlug = 'general' | 'airframe' | 'powerplant'

const examMeta: Record<ExamSlug, { title: string; description: string }> = {
  general: {
    title: 'General A&P Practice Questions | AMT Toolbox',
    description:
      'Free FAA General written exam practice questions covering mathematics, physics, regulations, publications, weight & balance, and fluid lines.',
  },
  airframe: {
    title: 'Airframe A&P Practice Questions | AMT Toolbox',
    description:
      'Free FAA Airframe written exam practice questions covering sheet metal, welding, structures, hydraulics, landing gear, electrical systems, and flight controls.',
  },
  powerplant: {
    title: 'Powerplant A&P Practice Questions | AMT Toolbox',
    description:
      'Free FAA Powerplant written exam practice questions covering reciprocating and turbine engines, fuel metering, ignition systems, propellers, and lubrication.',
  },
}

export async function generateMetadata({
  params,
}: {
  params: { exam: string }
}): Promise<Metadata> {
  const slug = params.exam as ExamSlug
  const meta = examMeta[slug]
  if (!meta) return { title: 'Exam Not Found' }
  return meta
}

export function generateStaticParams() {
  return [{ exam: 'general' }, { exam: 'airframe' }, { exam: 'powerplant' }]
}

export default function ExamPage({ params }: { params: { exam: string } }) {
  const slug = params.exam as ExamSlug
  if (!examMeta[slug]) notFound()
  return <ExamPageClient exam={slug} />
}
