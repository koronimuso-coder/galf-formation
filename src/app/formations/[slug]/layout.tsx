import { GALF_FORMATIONS } from '@/lib/data'
import { Metadata } from 'next'
import { getFormationImage } from '@/lib/images'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const formation = GALF_FORMATIONS.find(f => f.slug === slug)
  
  if (!formation) return { title: "Formation non trouvée" }

  return {
    title: `${formation.name} | GALF FORMATION`,
    description: formation.shortDesc,
    openGraph: {
      title: formation.name,
      description: formation.shortDesc,
      images: [getFormationImage(formation.slug)],
    }
  }
}

export default function FormationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
