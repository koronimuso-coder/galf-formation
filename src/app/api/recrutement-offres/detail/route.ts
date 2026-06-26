import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Secure validation of the target URL to ensure we only scrape educarriere
    if (!url.startsWith('https://emploi.educarriere.ci/') && !url.startsWith('fallback-')) {
      return NextResponse.json({ error: 'Invalid url target' }, { status: 400 });
    }

    // Handle fallback jobs details
    if (url.startsWith('fallback-')) {
      return NextResponse.json({
        description: "Offre d'emploi détaillée du secteur BTP fournie par l'organisme partenaire.",
        company: "Entreprise BTP Partenaire",
        email: "recrutement@entreprise-btp.ci"
      });
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch job detail from Educarriere. Status: ${res.status}`);
    }

    const html = await res.text();

    // 1. Extract og:title to get the company name
    const ogTitleMatch = /<meta property="og:title"\s+content="([^"]+)"/i.exec(html) ||
                         /<meta content="([^"]+)"\s+property="og:title"/i.exec(html);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].replace(/&amp;/g, '&') : '';
    
    let company = "Entreprise partenaire BTP";
    if (ogTitle) {
      const parts = ogTitle.split(/ recrute | RECRUTE /i);
      if (parts.length > 0 && parts[0].trim()) {
        company = parts[0].replace(/&amp;/g, '&').trim();
      }
    }

    // 2. Extract description (from <div class="post-body">...</div> or the col-xl-9 sub-div)
    let descriptionHtml = '';
    const bodyStartIdx = html.indexOf('<div class="post-body">');
    if (bodyStartIdx !== -1) {
      // Find the col-xl-9 section inside the post-body
      const descStartTag = '<div class="col-xl-9" style="background: #FFF;">';
      const descStartIdx = html.indexOf(descStartTag, bodyStartIdx);
      if (descStartIdx !== -1) {
        // Find closing of that col-xl-9 div (or the next hr/alert before footer)
        const hrIdx = html.indexOf('<hr>', descStartIdx);
        const alertIdx = html.indexOf('<div class="alert', descStartIdx);
        let endIdx = html.indexOf('</div>', descStartIdx + descStartTag.length);
        
        // Take the earliest logical boundary
        const boundaries = [hrIdx, alertIdx, endIdx].filter(x => x !== -1);
        if (boundaries.length > 0) {
          endIdx = Math.min(...boundaries);
        }
        
        descriptionHtml = html.substring(descStartIdx + descStartTag.length, endIdx).trim();
      } else {
        // Fallback: take a large chunk of post-body
        const bodyEndIdx = html.indexOf('<!-- end post body -->', bodyStartIdx);
        descriptionHtml = html.substring(bodyStartIdx, bodyEndIdx !== -1 ? bodyEndIdx : bodyStartIdx + 10000).trim();
      }
    }

    // 3. Clean up the description HTML or keep relevant formatting
    // Let's strip out ads, scripts, comments and keep clean paragraphs/lists
    const cleanDesc = descriptionHtml
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();

    // 4. Extract emails from the description text
    const textContentForEmails = cleanDesc.replace(/<[^>]+>/g, ' ');
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const allEmails = textContentForEmails.match(emailRegex) || [];
    
    // Filter out site support or educarriere emails
    const candidateEmails = Array.from(new Set(allEmails)).filter(email => {
      const lower = email.toLowerCase();
      return !lower.includes('educarriere') && !lower.includes('ci@educarriere') && !lower.includes('webmaster');
    });

    const contactEmail = candidateEmails.length > 0 ? candidateEmails[0] : "recrutement@galf-formation.ci"; // default contact email if none found

    return NextResponse.json({
      company,
      description: cleanDesc,
      email: contactEmail
    });

  } catch (error: any) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
