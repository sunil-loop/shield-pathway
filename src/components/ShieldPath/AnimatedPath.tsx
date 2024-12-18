import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PathSegment from './PathSegment';
import ShieldIcon from './ShieldIcon';

gsap.registerPlugin(ScrollTrigger);

const AnimatedPath: React.FC = () => {
  const [shieldPosition, setShieldPosition] = useState({ x: 100, y: 200 });
  const [shieldRotation, setShieldRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const segments = document.querySelectorAll('.path-segment');
    let totalLength = 0;
    const segmentPositions: { start: number; end: number; element: Element }[] = [];

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
          const angle = 45 * (Math.PI / 180);
          const distance = rect.width * segmentProgress;
          x = rect.left + Math.cos(angle) * distance;
          y = rect.top + Math.sin(angle) * distance;
        } else {
          x = rect.left + rect.width * segmentProgress;
          y = rect.top;
        }

        setShieldPosition({ x, y });
        const angle = isVertical ? 90 : isDiagonal ? 45 : 0;
        setShieldRotation(angle);
      }
    };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: { 
        duration: 2,
        smoothing: 1
      },
      onUpdate: (self) => {
        updateShieldPosition(self.progress);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[200vh] py-20">
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
        length={300}
        position={{ x: 400, y: 500 }}
      />
      <PathSegment
        id="segment5-diagonal"
        direction="diagonal"
        length={141}
        position={{ x: 700, y: 500 }}
        angle={-45}
      />
      <PathSegment
        id="segment6-vertical"
        direction="vertical"
        length={300}
        position={{ x: 800, y: 600 }}
      />
      <PathSegment
        id="segment7"
        direction="horizontal"
        length={400}
        position={{ x: 800, y: 900 }}
      />
      <PathSegment
        id="segment8-diagonal"
        direction="diagonal"
        length={200}
        position={{ x: 1200, y: 900 }}
        angle={45}
      />
      <ShieldIcon position={shieldPosition} rotation={shieldRotation} />
    </div>
  );
};

export default AnimatedPath;