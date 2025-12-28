import { useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

interface StatCounterProps {
    value: number;
    duration?: number;
    className?: string;
    suffix?: string;
}

export const StatCounter = ({ value, duration = 2, className, suffix = "" }: StatCounterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
        duration: duration * 1000
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest)) + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className={className}>0{suffix}</span>;
};
