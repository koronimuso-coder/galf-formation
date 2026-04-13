/** Maps formation slugs to their corresponding equipment images */
export function getFormationImage(slug: string): string {
  const map: Record<string, string> = {
    'carte-operateur': '/images/engins/chariot-elevateur.png',
    'chariot-elevateur': '/images/engins/chariot-elevateur.png',
    'hse': '/images/engins/bulldozer.png',
    'anglais-minier': '/images/engins/tombereau-rigide.png',
    'pelle-hydraulique': '/images/engins/pelle-hydraulique.png',
    'chargeuse': '/images/engins/chargeuse.png',
    'sino-truck': '/images/engins/tombereau-rigide.png',
    'grue-mobile': '/images/engins/grue-mobile.png',
    'grue-auxiliaire': '/images/engins/grue-mobile.png',
    'challenger': '/images/engins/tractopelle.png',
    'bulldozer': '/images/engins/bulldozer.png',
    'tractopelle': '/images/engins/tractopelle.png',
    'tombereau-articule': '/images/engins/tombereau-rigide.png',
    'tombereau-rigide': '/images/engins/tombereau-rigide.png',
    'compacteur': '/images/engins/bulldozer.png',
    'forage-hydraulique': '/images/engins/pelle-hydraulique.png',
    'forage-minier': '/images/engins/tombereau-rigide.png',
    'grue-tour': '/images/engins/grue-tour.png',
    'porte-char': '/images/engins/tombereau-rigide.png',
  }
  return map[slug] || '/images/engins/pelle-hydraulique.png'
}
