export const GsapWrapperCode = `
"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function GsapWrapper({ children, effect }: { children: React.ReactNode, effect: string }) {
  const container = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (effect === 'fadeUp') {
        gsap.fromTo(container.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
      } else if (effect === 'stagger') {
        gsap.fromTo(container.current?.children || [], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 });
      }
    }, container);
    return () => ctx.revert();
  }, [effect]);

  return <div ref={container}>{children}</div>;
}
`.trim();
