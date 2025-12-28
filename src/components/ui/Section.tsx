import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    fullHeight?: boolean;
    centered?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(({
    children,
    className,
    fullHeight = false,
    centered = false,
    ...props
}, ref) => {
    const internalRef = useRef<HTMLElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLElement);

    useGSAP(() => {
        gsap.fromTo(internalRef.current,
            { autoAlpha: 0, y: 50 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: internalRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }, { scope: internalRef });

    return (
        <section
            ref={internalRef}
            className={cn(
                "relative w-full px-6 py-20 overflow-hidden",
                fullHeight ? "min-h-screen flex flex-col" : "",
                centered ? "items-center justify-center" : "",
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
});

Section.displayName = "Section";

export default Section;
