import { NextResponse } from 'next/server';

// In-memory cache for scraped jobs
let jobsCache: {
  timestamp: number;
  data: any[];
} | null = null;

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Curated list of high-quality fallback jobs in Ivory Coast
const FALLBACK_JOBS = [
  {
    title: "Ingénieur Principal BTP / Chef de Projet",
    company: "SOGEA-SATOM Côte d'Ivoire",
    link: "fallback-1",
    code: "F-101",
    pubDate: new Date().toLocaleDateString('fr-FR'),
    limitDate: "31/12/2026",
    image: "https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg",
    description: "Nous recherchons un Ingénieur BTP principal pour piloter des projets d'infrastructures routières majeurs à Abidjan et à l'intérieur du pays. Rattaché au Directeur des Opérations, vous coordonnerez les travaux et veillerez à la rentabilité et la sécurité du chantier.",
    requirements: "Diplôme d'Ingénieur Génie Civil (Bac+5), minimum 5 ans d'expérience dans la conduite de grands chantiers de voirie et réseaux divers (VRD). Maîtrise d'AutoCAD et de MS Project.",
    email: "recrutement.satom-ci@sogea-satom.com",
    isFallback: true
  },
  {
    title: "Conducteur de Pelle Hydraulique",
    company: "COLAS Afrique",
    link: "fallback-2",
    code: "F-102",
    pubDate: new Date().toLocaleDateString('fr-FR'),
    limitDate: "30/11/2026",
    image: "https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg",
    description: "COLAS recrute des opérateurs d'engins qualifiés pour la conduite de pelles hydrauliques sur chenilles. Missions de terrassement, chargement et nivellement fin de terrains pour la construction de plateformes industrielles.",
    requirements: "Certificat CQP/CACES ou formation équivalente homologuée (ex: GALF). Minimum 3 ans d'expérience sur engin de terrassement. Rigueur et sens élevé de la sécurité HSE.",
    email: "recrutement.colas-ci@colas.com",
    isFallback: true
  },
  {
    title: "Technicien Supérieur Génie Civil",
    company: "PFO Africa",
    link: "fallback-3",
    code: "F-103",
    pubDate: new Date().toLocaleDateString('fr-FR'),
    limitDate: "15/12/2026",
    image: "https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg",
    description: "Pour nos chantiers de construction résidentiels et tertiaires à Abidjan, nous recrutons un Technicien Supérieur en Génie Civil. Vous assurerez le suivi technique, le contrôle qualité des bétons et le suivi des sous-traitants.",
    requirements: "Titulaire d'un BTS Génie Civil / Bâtiment, 3 ans d'expérience minimum. Capacité de lecture de plans d'exécution et de ferraillage complexes.",
    email: "carrieres@pfoafrica.com",
    isFallback: true
  },
  {
    title: "Conducteur de Grue à Tour",
    company: "Bouygues Bâtiment International CI",
    link: "fallback-4",
    code: "F-104",
    pubDate: new Date().toLocaleDateString('fr-FR'),
    limitDate: "31/12/2026",
    image: "https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg",
    description: "Dans le cadre de la construction de tours de grande hauteur, vous serez responsable de la conduite de grues à tour à cabine. Levage de banches, de ferraillages et coulages de béton en hauteur en respectant strictement les consignes de sécurité.",
    requirements: "Permis de grutier requis, attestation GALF ou habilitation CACES à jour. Minimum 5 ans d'expérience sur grues à tour de marque Potain ou similaires.",
    email: "recrutement.bouygues-ci@bouygues-construction.com",
    isFallback: true
  },
  {
    title: "Chargé de Sécurité HSE (Chantiers BTP)",
    company: "Krom & Partners BTP",
    link: "fallback-5",
    code: "F-105",
    pubDate: new Date().toLocaleDateString('fr-FR'),
    limitDate: "30/10/2026",
    image: "https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg",
    description: "Vous veillerez à l'application des consignes d'hygiène, sécurité et environnement sur un chantier de construction de ponts. Animation des quarts d'heure sécurité, contrôle des EPI, rédaction de rapports d'incidents.",
    requirements: "Bac+3/4 en QHSE avec une spécialisation ou première expérience de 2 ans minimum sur des chantiers de BTP / travaux publics.",
    email: "rh@krom-partners-btp.com",
    isFallback: true
  },
  {
    title: "Chef de Chantier Gros Œuvre",
    company: "BATI-PLUS Côte d'Ivoire",
    link: "fallback-6",
    code: "F-106",
    pubDate: new Date().toLocaleDateString('fr-FR'),
    limitDate: "15/10/2026",
    image: "https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg",
    description: "Rattaché au conducteur de travaux, vous gérez au quotidien une équipe de maçons et de coffreurs. Planification des tâches quotidiennes, commande des approvisionnements en béton et suivi d'avancement.",
    requirements: "Bac+2 minimum ou forte expérience de terrain (8 ans) comme chef d'équipe gros œuvre. Leadership et rigueur indispensables.",
    email: "cv@batiplus-ci.com",
    isFallback: true
  }
];

const BTP_KEYWORDS = [
  'btp', 'génie civil', 'batiment', 'bâtiment', 'travaux publics', 'construction', 
  'grutier', 'pelle', 'conducteur', 'engin', 'hse', 'qhse', 'chantier', 'maçon', 
  'architecte', 'infrastructures', 'métreur', 'coffreur', 'ferrailleur', 'vrd',
  'fondations', 'hydraulique', 'conductrice', 'conducteurs', 'projet'
];

export async function GET() {
  try {
    // Check cache
    if (jobsCache && (Date.now() - jobsCache.timestamp < CACHE_TTL)) {
      return NextResponse.json({ source: 'cache', data: jobsCache.data });
    }

    // Call external website to scrape
    const postData = new URLSearchParams();
    postData.append('rechoffres', '1');
    postData.append('mots_cles', 'BTP');
    postData.append('button', 'submit');

    const res = await fetch('https://emploi.educarriere.ci/emploi/page/all', {
      method: 'POST',
      body: postData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache fetch for 1 hour at next level
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Educarriere. Status: ${res.status}`);
    }

    const html = await res.text();
    const chunks = html.split('<div class="rt-post post-md style-8">');
    
    if (chunks.length <= 1) {
      throw new Error('No job elements found in HTML');
    }

    const scrapedJobs: any[] = [];

    // Parse chunks
    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Extract Link
      const linkMatch = /href="([^"]+)"/i.exec(chunk);
      if (!linkMatch) continue;
      let link = linkMatch[1].trim();
      if (!link.startsWith('http')) {
        link = `https://emploi.educarriere.ci${link.startsWith('/') ? '' : '/'}${link}`;
      }

      // Extract Title
      const titleMatch = /<h4 class="post-title">[\s\S]*?>([\s\S]*?)<\/a>/i.exec(chunk);
      if (!titleMatch) continue;
      const title = titleMatch[1].replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim();

      // Filter by BTP keywords to ensure relevance
      const lowerTitle = title.toLowerCase();
      const isBtp = BTP_KEYWORDS.some(kw => lowerTitle.includes(kw));
      if (!isBtp) continue;

      // Extract Code
      const codeMatch = /Code:<\/strong>\s*<span[^>]*>([\s\S]*?)<\/span>/i.exec(chunk);
      const code = codeMatch ? codeMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : '';

      // Extract Publication Date
      const pubDateMatch = /Date d'édition:<\/strong>\s*<span[^>]*>([\s\S]*?)<\/span>/i.exec(chunk);
      const pubDate = pubDateMatch ? pubDateMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : '';

      // Extract Limit Date
      const limitDateMatch = /Date limite:<\/strong>\s*<span[^>]*>([\s\S]*?)<\/span>/i.exec(chunk);
      const limitDate = limitDateMatch ? limitDateMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : '';

      // Extract Image
      const imgMatch = /<img[^>]+src="([^"]+)"/i.exec(chunk);
      let image = imgMatch ? imgMatch[1].trim() : 'https://www.educarriere.ci/pics/icone_fcbk_edu2.jpg';
      if (!image.startsWith('http')) {
        image = `https://emploi.educarriere.ci${image.startsWith('/') ? '' : '/'}${image}`;
      }

      scrapedJobs.push({
        title,
        company: "Entreprise partenaire BTP", // will load company from og:title on details
        link,
        code,
        pubDate,
        limitDate,
        image,
        isFallback: false
      });
    }

    // Merge scraped jobs with fallback jobs to ensure a rich list of offers
    const finalJobs = [...scrapedJobs, ...FALLBACK_JOBS];
    
    // Save to cache
    jobsCache = {
      timestamp: Date.now(),
      data: finalJobs
    };

    return NextResponse.json({ source: 'live', data: finalJobs });
  } catch (error: any) {
    console.error('Error scraping job offers from Educarriere:', error);
    
    // Fallback: return fallback jobs if scraping fails
    return NextResponse.json({ 
      source: 'fallback', 
      data: FALLBACK_JOBS,
      error: error.message 
    });
  }
}
