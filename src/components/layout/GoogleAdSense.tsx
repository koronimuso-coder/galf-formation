import Script from 'next/script';

export function GoogleAdSense() {
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!adSenseClientId) {
    // If no client ID is provided in development, we do not inject the script.
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
