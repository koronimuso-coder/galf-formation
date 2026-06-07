/** Maps formation slugs to their corresponding equipment images */
export function getFormationImage(slug: string): string {
  const map: Record<string, string> = {
    'carte-operateur': '/images/formations/carte-operateur.png?v=3',
    'chariot-elevateur': '/images/formations/chariot-elevateur.png?v=3',
    'hse': '/images/formations/hse.png?v=3',
    'anglais-minier': '/images/formations/anglais-minier.png?v=3',
    'pelle-hydraulique': '/images/formations/pelle-hydraulique.png?v=3',
    'chargeuse': '/images/formations/chargeuse.png?v=3',
    'sino-truck': '/images/formations/sino-truck.png?v=3',
    'grue-mobile': '/images/formations/grue-mobile.png?v=3',
    'grue-auxiliaire': '/images/formations/grue-auxiliaire.png?v=3',
    'challenger': '/images/formations/challenger.png?v=3',
    'bulldozer': '/images/formations/bulldozer.png?v=3',
    'tractopelle': '/images/formations/tractopelle.png?v=3',
    'tombereau-articule': '/images/formations/tombereau-articule.png?v=3',
    'tombereau-rigide': '/images/formations/tombereau-rigide.png?v=3',
    'compacteur': '/images/formations/compacteur.png?v=3',
    'forage-hydraulique': '/images/formations/forage-hydraulique.png?v=3',
    'forage-minier': '/images/formations/forage-minier.png?v=3',
    'grue-tour': '/images/formations/grue-tour.png?v=3',
    'porte-char': '/images/formations/porte-char.png?v=3',
    'chariot-telescopique': '/images/formations/chariot-telescopique.png?v=3',
  }
  return map[slug] || '/images/formations/pelle-hydraulique.png?v=3'
}

/** Maps page paths to their corresponding cinematic header animations */
export function getPageHeaderImage(path: string): string {
  const map: Record<string, string> = {
    '/apprenant': '/images/headers/apprenant.webp',
    '/entreprise': '/images/headers/entreprise.webp',
    '/contact': '/images/headers/contact.png',
    '/a-propos': '/images/headers/a-propos.png',
    '/faq': '/images/headers/faq.webp',
    '/mediatheque': '/images/headers/mediatheque.png',
    '/formations': '/images/headers/formations.png',
    '/blog': '/images/headers/actualites.png',
  }
  
  // Find matching path or return default
  const match = Object.keys(map).find(key => path.startsWith(key))
  return (match ? map[match] : null) || '/images/headers/formations.png'
}
