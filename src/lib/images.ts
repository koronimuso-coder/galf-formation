/** Maps formation slugs to their corresponding equipment images */
export function getFormationImage(slug: string): string {
  const map: Record<string, string> = {
    'carte-operateur': '/images/engins/chariot-elevateur.png',
    'chariot-elevateur': '/images/engins/chariot-elevateur.png',
    'hse': '/images/engins/bulldozer.png',
    'anglais-minier': '/images/engins/tombereau-articule.png',
    'pelle-hydraulique': '/images/engins/pelle-hydraulique.png',
    'chargeuse': '/images/engins/chargeuse.png',
    'sino-truck': '/images/engins/sino-truck.png',
    'grue-mobile': '/images/engins/grue-mobile.png',
    'grue-auxiliaire': '/images/engins/grue-auxiliaire.png',
    'challenger': '/images/engins/niveleuse.png',
    'bulldozer': '/images/engins/bulldozer.png',
    'tractopelle': '/images/engins/tractopelle.png',
    'tombereau-articule': '/images/engins/tombereau-articule.png',
    'tombereau-rigide': '/images/engins/sino-truck.png',
    'compacteur': '/images/engins/compacteur.png',
    'forage-hydraulique': '/images/engins/forage-hydraulique.png',
    'forage-minier': '/images/engins/forage-minier.png',
    'grue-tour': '/images/engins/grue-tour.png',
    'porte-char': '/images/engins/sino-truck.png',
    'chariot-telescopique': '/images/engins/chariot-telescopique.png',
  }
  return map[slug] || '/images/engins/pelle-hydraulique.png'
}

/** Maps page paths to their corresponding cinematic header animations */
export function getPageHeaderImage(path: string): string {
  const map: Record<string, string> = {
    '/apprenant': '/images/headers/apprenant.webp',
    '/entreprise': '/images/headers/entreprise.webp',
    '/contact': '/images/headers/contact.webp',
    '/a-propos': '/images/headers/about.webp',
    '/faq': '/images/headers/faq.webp',
    '/mediatheque': '/images/headers/mediatheque.webp',
    '/formations': '/images/headers/formations.webp',
  }
  
  // Find matching path or return default
  const match = Object.keys(map).find(key => path.startsWith(key))
  return (match ? map[match] : null) || '/images/headers/formations.webp'
}
