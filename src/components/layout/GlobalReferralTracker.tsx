"use client"
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { logReferralClick, setAttributionCookie } from '@/lib/firebase/services/referral'

function Tracker() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    if (ref) {
      setAttributionCookie(ref)
      logReferralClick(
        ref,
        "client-ip",
        typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
        typeof document !== "undefined" ? document.referrer : "direct"
      ).catch(err => console.error("Global referral log click failed:", err))
    }
  }, [ref])

  return null
}

export function GlobalReferralTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
