import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PathSegment from './PathSegment';
import ShieldIcon from './ShieldIcon';

gsap.registerPlugin(ScrollTrigger);

const AnimatedPath: React.FC = () => {
  const [shieldPosition, setShieldPosition] = useState({ x: 100, y: 200 }); // Start at first segment
  const [shieldRotation, setShieldRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const segments = document.querySelectorAll('.path-segment');
    let totalLength = 0;
    const segmentPositions: { start: number; end: number; element: Element }[] = [];

    // Calculate total path length and segment positions
    segments.forEach((segment) => {
      const rect = segment.getBoundingClientRect();
      const length = segment.id.includes('vertical') ? rect.height : rect.width;
      segmentPositions.push({
        start: totalLength,
        end: totalLength + length,
        element: segment,
      });
      totalLength += length;
    });

    const updateShieldPosition = (progress: number) => {
      const currentPosition = progress * totalLength;
      const currentSegment = segmentPositions.find(
        (segment) => currentPosition >= segment.start && currentPosition <= segment.end
      );

      if (currentSegment) {
        const rect = currentSegment.element.getBoundingClientRect();
        const segmentProgress =
          (currentPosition - currentSegment.start) /
          (currentSegment.end - currentSegment.start);

        let x, y;
        const isVertical = currentSegment.element.id.includes('vertical');
        const isDiagonal = currentSegment.element.id.includes('diagonal');

        if (isVertical) {
          x = rect.left;
          y = rect.top + rect.height * segmentProgress;
        } else if (isDiagonal) {
          const angle = 45 * (Math.PI / 180); // Convert 45 degrees to radians
          const distance = rect.width * segmentProgress;
          x = rect.left + Math.cos(angle) * distance;
          y = rect.top + Math.sin(angle) * distance;
        } else {
          x = rect.left + rect.width * segmentProgress;
          y = rect.top;
        }

        setShieldPosition({ x, y });

        // Update rotation based on segment type
        const angle = isVertical ? 90 : isDiagonal ? 45 : 0;
        setShieldRotation(angle);
      }
    };

    // Create scroll trigger animation
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        updateShieldPosition(self.progress);
      },
    });

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      <PathSegment
        id="segment1"
        direction="horizontal"
        length={200}
        position={{ x: 100, y: 200 }}
      />
      <PathSegment
        id="segment2-diagonal"
        direction="diagonal"
        length={141}
        position={{ x: 300, y: 200 }}
        angle={45}
      />
      <PathSegment
        id="segment3-vertical"
        direction="vertical"
        length={200}
        position={{ x: 400, y: 300 }}
      />
      <PathSegment
        id="segment4"
        direction="horizontal"
        length={200}
        position={{ x: 400, y: 500 }}
      />
      <ShieldIcon position={shieldPosition} rotation={shieldRotation} />
    </div>
  );
};

export default AnimatedPath;