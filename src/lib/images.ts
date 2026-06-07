/** Maps formation slugs to their corresponding equipment images */
export function getFormationImage(slug: string): string {
  const map: Record<string, string> = {
    'carte-operateur': '/images/formations/chariot-elevateur.png',
    'chariot-elevateur': '/images/formations/chariot-elevateur.png',
    'hse': '/images/formations/hse.png',
    'anglais-minier': '/images/formations/anglais-minier.png',
    'pelle-hydraulique': '/images/formations/pelle-hydraulique.png',
    'chargeuse': '/images/formations/chargeuse.png',
    'sino-truck': '/images/formations/tombereau-rigide.png',
    'grue-mobile': '/images/engins/grue-mobile.png',
    'grue-auxiliaire': '/images/engins/grue-auxiliaire.png',
    'challenger': '/images/formations/challenger.png',
    'bulldozer': '/images/formations/bulldozer.png',
    'tractopelle': '/images/formations/tractopelle.png',
    'tombereau-articule': '/images/formations/tombereau-articule.png',
    'tombereau-rigide': '/images/formations/tombereau-rigide.png',
    'compacteur': '/images/formations/compacteur.png',
    'forage-hydraulique': '/images/formations/forage-hydraulique.png',
    'forage-minier': '/images/formations/forage-minier.png',
    'grue-tour': '/images/engins/grue-tour.png',
    'porte-char': '/images/formations/porte-char.png',
    'chariot-telescopique': '/images/formations/chariot-telescopique.png',
  }
  return map[slug] || '/images/formations/pelle-hydraulique.png'
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
