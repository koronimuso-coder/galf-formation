"use client"
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedMachineHeader({ 
  type = 'pelle',
  className = '',
  color = 'var(--galf-yellow)' 
}: { 
  type?: 'pelle' | 'grue' | 'bulldozer' | 'chargeuse',
  className?: string,
  color?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Pelle refs
  const pArmBaseRef = useRef<SVGGElement>(null)
  const pArmTopRef = useRef<SVGGElement>(null)
  const pBucketRef = useRef<SVGGElement>(null)

  // Grue refs
  const gJibRef = useRef<SVGGElement>(null)
  const gHookCableRef = useRef<SVGLineElement>(null)
  const gHookRef = useRef<SVGGElement>(null)

  // Bulldozer refs
  const bWheelsRef = useRef<SVGGElement>(null)
  const bBladeRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Floating effect for main svg groups to make it organic
      gsap.to('.machine-cab', {
        y: -3,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      if (type === 'pelle') {
        gsap.to(pArmBaseRef.current, {
          rotation: 12,
          transformOrigin: "42px 85px",
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        })
        gsap.to(pArmTopRef.current, {
          rotation: -35,
          transformOrigin: "115px 35px",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 0.5
        })
        gsap.to(pBucketRef.current, {
          rotation: 40,
          transformOrigin: "155px 105px",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1
        })
      }

      if (type === 'grue') {
         gsap.to(gJibRef.current, {
            rotation: 4,
            transformOrigin: "60px 30px", // top of the tower
            duration: 6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
         })
         gsap.to(gHookCableRef.current, {
            attr: { y2: 130 },
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
         })
         gsap.to(gHookRef.current, {
            y: 35,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
         })
      }

      if (type === 'bulldozer' || type === 'chargeuse') {
         gsap.to(bWheelsRef.current?.children || [], {
            rotation: 360,
            transformOrigin: "50% 50%",
            duration: 4,
            repeat: -1,
            ease: "none"
         })
         gsap.to(bBladeRef.current, {
            y: -10,
            rotation: -8,
            transformOrigin: "150px 100px",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
         })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [type])

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center opacity-70 mix-blend-screen drop-shadow-[0_0_20px_rgba(255,176,0,0.4)] ${className}`}>
      
      {type === 'pelle' && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Tracks */}
          <path d="M30,135 L100,135 A10,10 0 0,0 110,125 L110,115 A10,10 0 0,0 100,105 L30,105 A10,10 0 0,0 20,115 L20,125 A10,10 0 0,0 30,135 Z" />
          <circle cx="40" cy="120" r="5" />
          <circle cx="65" cy="120" r="5" />
          <circle cx="90" cy="120" r="5" />
          
          <g className="machine-cab">
            {/* Cab */}
            <path d="M40,105 L40,55 L70,55 L80,105 Z" />
            {/* Window */}
            <path d="M45,60 L65,60 L72,85 L45,85 Z" />
            {/* Body Back */}
            <path d="M80,105 L85,85 L105,85 L105,105 Z" />
            
            {/* Arm Base Group */}
            <g ref={pArmBaseRef} style={{ transformOrigin: '42px 85px' }}>
              <path d="M42,85 L115,35" strokeWidth="5" />
              {/* Arm Pistons details */}
              <line x1="60" y1="90" x2="90" y2="55" strokeWidth="1.5" />
              
              {/* Arm Top Group */}
              <g ref={pArmTopRef} style={{ transformOrigin: '115px 35px' }}>
                <path d="M115,35 L155,105" strokeWidth="4" />
                <circle cx="115" cy="35" r="4" fill={color} />
                
                {/* Bucket Group */}
                <g ref={pBucketRef} style={{ transformOrigin: '155px 105px' }}>
                  <circle cx="155" cy="105" r="3" fill={color} />
                  <path d="M155,105 L145,125 L165,130 L175,110 Z" strokeWidth="2.5" />
                  <path d="M165,130 L170,140" />
                  <path d="M155,127 L160,137" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      )}

      {type === 'grue' && (
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Base */}
          <path d="M40,190 L80,190" strokeWidth="4" />
          <path d="M50,190 L60,30" strokeWidth="3" />
          <path d="M70,190 L60,30" strokeWidth="3" />
          {/* Tower X bracing */}
          <path d="M51,170 L69,150 M69,170 L51,150" strokeWidth="1" opacity="0.6" />
          <path d="M52,150 L68,130 M68,150 L52,130" strokeWidth="1" opacity="0.6" />
          <path d="M54,130 L66,110 M66,130 L54,110" strokeWidth="1" opacity="0.6" />
          <path d="M55,110 L65,90 M65,110 L55,90" strokeWidth="1" opacity="0.6" />
          <path d="M57,90 L63,70 M63,90 L57,70" strokeWidth="1" opacity="0.6" />
          
          <g className="machine-cab" ref={gJibRef} style={{ transformOrigin: '60px 30px' }}>
             {/* Cab */}
             <rect x="65" y="35" width="15" height="20" />
             <path d="M60,30 L60,10 L80,10 L70,30" strokeWidth="2" />
             
             {/* Counter Jib */}
             <path d="M60,30 L20,30 L20,35 L60,35" />
             <rect x="25" y="20" width="15" height="10" fill="currentColor" opacity="0.5" />
             <path d="M60,10 L25,20" strokeWidth="1" />

             {/* Main Jib */}
             <path d="M60,30 L180,30" strokeWidth="3" />
             <path d="M60,35 L180,35" strokeWidth="2" />
             {/* Jib X bracing */}
             {[...Array(11)].map((_, i) => (
                <path key={i} d={`M${70 + i*10},30 L${75 + i*10},35 M${75 + i*10},30 L${70 + i*10},35`} strokeWidth="1" opacity="0.6" />
             ))}
             
             {/* Tie ties */}
             <path d="M60,10 L120,30" strokeWidth="1" />
             <path d="M60,10 L160,30" strokeWidth="1" />

             {/* Troll and hook */}
             <rect x="140" y="36" width="15" height="6" />
             <line ref={gHookCableRef} x1="147" y1="42" x2="147" y2="95" strokeWidth="1.5" />
             <g ref={gHookRef}>
               <path d="M147,95 L143,105 L151,105 Z" fill="currentColor" />
               <path d="M147,105 Q140,115 147,120 Q152,118 150,112" strokeWidth="2" />
             </g>
          </g>
        </svg>
      )}

      {(type === 'bulldozer' || type === 'chargeuse') && (
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-full overflow-visible" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="machine-cab">
             {/* Body */}
             <path d="M30,110 L30,60 L70,60 L80,100 L120,100 L130,120 L30,120 Z" />
             {/* Window */}
             <path d="M35,65 L65,65 L72,90 L35,90 Z" />
             {/* Engine */}
             <path d="M80,100 L120,100 L120,80 L85,80" strokeWidth="1.5" opacity="0.7" />
             
             {/* Wheels */}
             <g ref={bWheelsRef}>
               {/* Wheel 1 */}
               <g style={{ transformOrigin: '50px 120px' }}>
                 <circle cx="50" cy="120" r="18" strokeWidth="3" />
                 <path d="M50,102 L50,138 M32,120 L68,120" strokeWidth="2" />
               </g>
               {/* Wheel 2 */}
               <g style={{ transformOrigin: '110px 120px' }}>
                 <circle cx="110" cy="120" r="18" strokeWidth="3" />
                 <path d="M110,102 L110,138 M92,120 L128,120" strokeWidth="2" />
               </g>
             </g>

             {/* Arm & Blade */}
             <g ref={bBladeRef} style={{ transformOrigin: '70px 100px' }}>
               <path d="M70,100 L140,110" strokeWidth="4" />
               <path d="M140,80 Q150,100 145,130 L130,130" strokeWidth="3" />
               <path d="M130,130 L140,110" strokeWidth="2" />
               <circle cx="140" cy="110" r="3" fill={color} />
             </g>
          </g>
        </svg>
      )}

    </div>
  )
}
