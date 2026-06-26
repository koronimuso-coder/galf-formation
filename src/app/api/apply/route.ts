import { NextResponse } from 'next/server';
import { dbAddDoc } from '@/lib/firebase/services/dbClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, jobTitle, jobCode, employerEmail, cvName, cvSize } = body;

    // Basic validation
    if (!name || !email || !phone || !jobTitle || !jobCode || !employerEmail) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Save application to database (Firestore or LocalStorage fallback)
    const applicationData = {
      name,
      email,
      phone,
      message: message || '',
      jobTitle,
      jobCode,
      employerEmail,
      cvName: cvName || 'cv_attache.pdf',
      cvSize: cvSize || 0,
      status: 'soumis',
      appliedAt: new Date().toISOString()
    };

    const docId = await dbAddDoc('candidatures_recrutement', applicationData);

    return NextResponse.json({
      success: true,
      message: 'Candidature enregistrée avec succès dans le système GALF.',
      applicationId: docId
    });

  } catch (error: any) {
    console.error('Error saving application:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
