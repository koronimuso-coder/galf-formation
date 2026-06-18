import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://galfformation.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/apprenant/',
          '/candidat/',
          '/instructeur/',
          '/connexion',
          '/inscription',
          '/mot-de-passe-oublie',
          '/api/',
          '/programme-ambassadeur/admin/',
          '/programme-ambassadeur/commercial/',
          '/programme-ambassadeur/responsable/',
          '/programme-ambassadeur/dashboard/',
          '/programme-ambassadeur/connexion',
          '/programme-ambassadeur/inscription',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
