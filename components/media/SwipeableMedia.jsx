"use client";

import { useRef, useState } from "react";

export default function SwipeableMedia({
    children,
    previous,
    next,
    onSwipeLeft,
    onSwipeRight,
    onClick,
    disabled = false,
}) {
    const containerRef = useRef(null);
    const touchStart = useRef(null);
    const touchCurrent = useRef(null);
    const isAnimating = useRef(false);

    const [dragX, setDragX] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const SWIPE_THRESHOLD = 50;
    const TRANSITION_DURATION = 220;
    const SWIPE_GAP = 5;

    const handleTouchStart = (e) => {
        if (
            disabled ||
            isAnimating.current ||
            !previous ||
            !next ||
            e.touches.length !== 1
        ) {
            return;
        }

        const touch = e.touches[0];

        touchStart.current = {
            x: touch.clientX,
            y: touch.clientY,
        };

        touchCurrent.current = {
            x: touch.clientX,
            y: touch.clientY,
        };
    };

    const handleTouchMove = (e) => {
        if (
            disabled ||
            isAnimating.current ||
            !touchStart.current ||
            e.touches.length !== 1
        ) {
            return;
        }

        const touch = e.touches[0];

        touchCurrent.current = {
            x: touch.clientX,
            y: touch.clientY,
        };

        const deltaX =
            touch.clientX - touchStart.current.x;

        const deltaY =
            touch.clientY - touchStart.current.y;

        // Let vertical gestures behave normally.
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }

        setDragX(deltaX * 0.6);
    };

    const handleTouchEnd = () => {
        if (
            disabled ||
            isAnimating.current ||
            !touchStart.current ||
            !touchCurrent.current
        ) {
            return;
        }

        const deltaX =
            touchCurrent.current.x - touchStart.current.x;

        const deltaY =
            touchCurrent.current.y - touchStart.current.y;

        const horizontalSwipe =
            Math.abs(deltaX) > Math.abs(deltaY) &&
            Math.abs(deltaX) >= SWIPE_THRESHOLD;

        if (!horizontalSwipe) {
            setIsTransitioning(true);
            setDragX(0);

            setTimeout(() => {
                setIsTransitioning(false);
            }, TRANSITION_DURATION);

            touchStart.current = null;
            touchCurrent.current = null;

            return;
        }

        const containerWidth =
            containerRef.current?.getBoundingClientRect().width ||
            window.innerWidth;

        isAnimating.current = true;
        setIsTransitioning(true);

        if (deltaX < 0) {
            // Swipe left.
            // Current image leaves to the left.
            // Next image enters from the right.
            setDragX(-(containerWidth + SWIPE_GAP));

            setTimeout(() => {
                onSwipeLeft?.();

                setDragX(0);
                setIsTransitioning(false);
                isAnimating.current = false;
            }, TRANSITION_DURATION);
        } else {
            // Swipe right.
            // Current image leaves to the right.
            // Previous image enters from the left.
            setDragX(containerWidth + SWIPE_GAP);

            setTimeout(() => {
                onSwipeRight?.();

                setDragX(0);
                setIsTransitioning(false);
                isAnimating.current = false;
            }, TRANSITION_DURATION);
        }

        touchStart.current = null;
        touchCurrent.current = null;
    };

    const handleTouchCancel = () => {
        if (isAnimating.current) return;

        setIsTransitioning(true);
        setDragX(0);

        setTimeout(() => {
            setIsTransitioning(false);
        }, TRANSITION_DURATION);

        touchStart.current = null;
        touchCurrent.current = null;
    };

    const showPrevious = dragX > 0;
    const showNext = dragX < 0;


    return (
        <div
            ref={containerRef}
            onClick={onClick}
            className="relative w-full h-full overflow-hidden"
            style={{
                touchAction: "pan-y",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
        >
            {/* Previous image */}

            {showPrevious && (
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        transform: `translateX(calc(-100% + ${dragX}px - ${SWIPE_GAP}px))`,
                        transition: isTransitioning
                            ? `transform ${TRANSITION_DURATION}ms ease-out`
                            : "none",
                    }}
                >
                    {previous}
                </div>
            )}

            {/* Next image */}

            {showNext && (
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        transform: `translateX(calc(100% + ${dragX}px + ${SWIPE_GAP}px))`,
                        transition: isTransitioning
                            ? `transform ${TRANSITION_DURATION}ms ease-out`
                            : "none",
                    }}
                >
                    {next}
                </div>
            )}
            {/* Current image */}

            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    transform: `translateX(${dragX}px)`,
                    transition: isTransitioning
                        ? `transform ${TRANSITION_DURATION}ms ease-out`
                        : "none",
                }}
            >
                {children}
            </div>
        </div>
    );
}