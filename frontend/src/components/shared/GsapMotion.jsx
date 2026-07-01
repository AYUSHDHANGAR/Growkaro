"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function GsapMotion() {
    const pathname = usePathname();
    useEffect(() => {
        let context;
        async function animate() {
            const { gsap } = await import("gsap");
            context = gsap.context(() => {
                const fadeTargets = gsap.utils.toArray("[data-gsap='fade-up']");
                const scaleTargets = gsap.utils.toArray("[data-gsap='scale-in']");
                if (fadeTargets.length) {
                    gsap.fromTo(fadeTargets, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.06 });
                }
                if (scaleTargets.length) {
                    gsap.fromTo(scaleTargets, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.05 });
                }
            });
        }
        void animate();
        return () => context?.revert();
    }, [pathname]);
    return null;
}
