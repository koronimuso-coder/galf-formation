"use client";

import { useEffect, useState } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
}

export function AdBanner({ slot, format = 'auto', responsive = true }: AdBannerProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    // Show placeholder in development or if the publisher ID is not defined
    if (process.env.NODE_ENV === 'development' || !clientId || clientId === 'ca-pub-placeholder') {
      setShowPlaceholder(true);
      return;
    }

    try {
      // Safely initialize the AdSense ad unit push
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (err) {
      console.error('AdSense AdBanner error:', err);
    }
  }, [clientId]);

  if (showPlaceholder || !clientId) {
    return (
      <div 
        className="w-full my-8 p-6 rounded-2xl border border-dashed border-galf-yellow/30 bg-black/10 dark:bg-white/5 flex flex-col items-center justify-center text-center select-none min-h-[120px]"
        style={{ border: '1px dashed var(--galf-yellow-30, rgba(255, 176, 0, 0.3))' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-galf-yellow animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-galf-yellow">
            Zone Publicitaire - Google AdSense
          </span>
        </div>
        <p className="text-[11px] max-w-md opacity-60" style={{ color: 'var(--galf-text-muted, #94a3b8)' }}>
          Cet encart publicitaire factice valide l'intégration du composant.<br />
          <span className="font-mono text-[9px]">Slot : {slot} | Format : {format}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full my-8 overflow-hidden flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
