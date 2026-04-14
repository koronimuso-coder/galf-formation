"use client"
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedMachineHeader({ 
  type = 'pelle',
  className = '',
  color = 'var(--galf-yellow)' 
}: { 
  type?: 'pelle' | 'grue' | 'bulldozer' | 'chargeuse' | 'camion' | 'foreuse' | 'nacelle' | 'rouleau',
  className?: string,
  color?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Refs
  const pArmBaseRef = useRef<SVGGElement>(null)
  const pArmTopRef = useRef<SVGGElement>(null)
  const pBucketRef = useRef<SVGGElement>(null)
  const gJibRef = useRef<SVGGElement>(null)
  const gHookCableRef = useRef<SVGLineElement>(null)
  const gHookRef = useRef<SVGGElement>(null)
  const bWheelsRef = useRef<SVGGElement>(null)
  const bBladeRef = useRef<SVGGElement>(null)
  
  // New machine refs
  const cBedRef = useRef<SVGGElement>(null)
  const fDrillRef = useRef<SVGGElement>(null)
  const nArmRef = useRef<SVGGElement>(null)
  const nBucketRef = useRef<SVGGElement>(null)
  const rDrumRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Floating effect for main svg groups
      gsap.to('.machine-cab', {
        y: -3,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      if (type === 'pelle') {
        gsap.to(pArmBaseRef.current, { rotation: 12, transformOrigin: "42px 85px", duration: 3, repeat: -1, yoyo: true, ease: "power1.inOut" })
        gsap.to(pArmTopRef.current, { rotation: -35, transformOrigin: "115px 35px", duration: 2.5, repeat: -1, yoyo: true, ease: "power2.inOut", delay: 0.5 })
        gsap.to(pBucketRef.current, { rotation: 40, transformOrigin: "155px 105px", duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 })
      }

      if (type === 'grue') {
         gsap.to(gJibRef.current, { rotation: 4, transformOrigin: "60px 30px", duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" })
         gsap.to(gHookCableRef.current, { attr: { y2: 130 }, duration: 4, repeat: -1, yoyo: true, ease: "power2.inOut" })
         gsap.to(gHookRef.current, { y: 35, duration: 4, repeat: -1, yoyo: true, ease: "power2.inOut" })
      }

      if (type === 'bulldozer' || type === 'chargeuse') {
         gsap.to(bWheelsRef.current?.children || [], { rotation: 360, transformOrigin: "50% 50%", duration: 4, repeat: -1, ease: "none" })
         gsap.to(bBladeRef.current, { y: -10, rotation: -8, transformOrigin: "150px 100px", duration: 2, repeat: -1, yoyo: true, ease: "power1.inOut" })
      }

      if (type === 'camion') {
         gsap.to(cBedRef.current, { rotation: -25, transformOrigin: "60px 115px", duration: 3, repeat: -1, yoyo: true, ease: "power2.inOut" })
         gsap.to(bWheelsRef.current?.children || [], { rotation: 360, transformOrigin: "50% 50%", duration: 5, repeat: -1, ease: "none" })
      }

      if (type === 'foreuse') {
         gsap.to(fDrillRef.current, { y: 60, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" })
         gsap.to('.drill-bit', { rotation: 1440, transformOrigin: "50% 50%", duration: 2, repeat: -1, ease: "none" })
      }

      if (type === 'nacelle') {
         gsap.to(nArmRef.current, { rotation: -40, transformOrigin: "60px 110px", duration: 4, repeat: -1, yoyo: true, ease: "power1.inOut" })
         gsap.to(nBucketRef.current, { y: -20, rotation: 10, transformOrigin: "140px 40px", duration: 4, repeat: -1, yoyo: true, ease: "power1.inOut" })
      }

      if (type === 'rouleau') {
         gsap.to(rDrumRef.current, { rotation: 360, transformOrigin: "50% 50%", duration: 6, repeat: -1, ease: "none" })
         gsap.to('.machine-cab', { y: -1.5, x: 0.5, duration: 0.05, repeat: -1, yoyo: true, ease: "none" })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [type])

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center opacity-70 mix-blend-screen drop-shadow-[0_0_20px_rgba(255,176,0,0.4)] ${className}`}>
      
      {type === 'pelle' && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30,135 L100,135 A10,10 0 0,0 110,125 L110,115 A10,10 0 0,0 100,105 L30,105 A10,10 0 0,0 20,115 L20,125 A10,10 0 0,0 30,135 Z" />
          <circle cx="40" cy="120" r="5" /><circle cx="65" cy="120" r="5" /><circle cx="90" cy="120" r="5" />
          <g className="machine-cab">
            <path d="M40,105 L40,55 L70,55 L80,105 Z" />
            <path d="M45,60 L65,60 L72,85 L45,85 Z" />
            <path d="M80,105 L85,85 L105,85 L105,105 Z" />
            <g ref={pArmBaseRef}><path d="M42,85 L115,35" strokeWidth="5" />
              <g ref={pArmTopRef}><path d="M115,35 L155,105" strokeWidth="4" /><circle cx="115" cy="35" r="4" fill={color} />
                <g ref={pBucketRef}><circle cx="155" cy="105" r="3" fill={color} /><path d="M155,105 L145,125 L165,130 L175,110 Z" strokeWidth="2.5" /></g>
              </g>
            </g>
          </g>
        </svg>
      )}

      {type === 'grue' && (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M40,190 L80,190" strokeWidth="4" /><path d="M50,190 L60,30" strokeWidth="3" /><path d="M70,190 L60,30" strokeWidth="3" />
          <g className="machine-cab" ref={gJibRef}>
             <rect x="65" y="35" width="15" height="20" /><path d="M60,30 L60,10 L80,10 L70,30" strokeWidth="2" />
             <path d="M60,30 L20,30 L20,35 L60,35" />
             <path d="M60,30 L180,30" strokeWidth="3" /><path d="M60,35 L180,35" strokeWidth="2" />
             <rect x="140" y="36" width="15" height="6" /><line ref={gHookCableRef} x1="147" y1="42" x2="147" y2="95" strokeWidth="1.5" />
             <g ref={gHookRef}><path d="M147,95 L143,105 L151,105 Z" fill="currentColor" /></g>
          </g>
        </svg>
      )}

      {(type === 'bulldozer' || type === 'chargeuse') && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="machine-cab">
             <path d="M30,110 L30,60 L70,60 L80,100 L120,100 L130,120 L30,120 Z" />
             <g ref={bWheelsRef}><circle cx="50" cy="120" r="18" strokeWidth="3" /><circle cx="110" cy="120" r="18" strokeWidth="3" /></g>
             <g ref={bBladeRef}><path d="M70,100 L140,110" strokeWidth="4" /><path d="M140,80 Q150,100 145,130 L130,130" strokeWidth="3" /></g>
          </g>
        </svg>
      )}

      {type === 'camion' && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="machine-cab">
             <path d="M20,115 L20,70 L50,70 L60,115 Z" />
             <g ref={cBedRef}><path d="M60,115 L160,115 L160,70 L60,70 Z" strokeWidth="4" /><path d="M100,115 L100,125" strokeWidth="2" /></g>
             <g ref={bWheelsRef}><circle cx="45" cy="125" r="12" strokeWidth="3" /><circle cx="120" cy="125" r="12" strokeWidth="3" /><circle cx="148" cy="125" r="12" strokeWidth="3" /></g>
          </g>
        </svg>
      )}

      {type === 'foreuse' && (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="machine-cab">
             <path d="M30,180 L110,180 L110,165 L30,165 Z" />
             <path d="M100,165 L100,20 L120,20 L120,165 Z" strokeWidth="3" />
             <g ref={fDrillRef}>
                <rect x="110" y="30" width="2" height="100" />
                <path className="drill-bit" d="M105,130 L115,130 L110,145 Z" fill={color} />
             </g>
          </g>
        </svg>
      )}

      {type === 'nacelle' && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="machine-cab">
             <path d="M40,130 L100,130 L100,110 L40,110 Z" />
             <g ref={nArmRef}><path d="M60,110 L140,40" strokeWidth="5" /><g ref={nBucketRef}><path d="M140,40 L130,40 L130,20 L150,20 L150,40 L140,40 Z" /></g></g>
          </g>
        </svg>
      )}

      {type === 'rouleau' && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="machine-cab">
             <path d="M80,120 L140,120 L140,80 L80,80 Z" />
             <circle cx="115" cy="120" r="15" strokeWidth="3" />
             <g ref={rDrumRef}><circle cx="45" cy="115" r="30" strokeWidth="5" /><path d="M45,85 L45,145" strokeWidth="1" opacity="0.3" /></g>
          </g>
        </svg>
      )}

    </div>
  )
}
