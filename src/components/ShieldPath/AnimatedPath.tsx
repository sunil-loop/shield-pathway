import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PathSegment from './PathSegment';
import ShieldIcon from './ShieldIcon';

gsap.registerPlugin(ScrollTrigger);

const AnimatedPath: React.FC = () => {
  const [shieldPosition, setShieldPosition] = useState({ x: 0, y: 0 });
  const [shieldRotation, setShieldRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const segments = document.querySelectorAll('.path-segment');
    let totalLength = 0;
    const segmentPositions: { start: number; end: number; element: Element }[] = [];

    segments.forEach((segment) => {
      const rect = segment.getBoundingClientRect();
      const length = rect.width;
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

        setShieldPosition({
          x: rect.left + rect.width * segmentProgress,
          y: rect.top + rect.height / 2,
        });

        // Calculate rotation based on segment direction
        const angle = currentSegment.element.id.includes('diagonal')
          ? 45
          : currentSegment.element.id.includes('vertical')
          ? 90
          : 0;
        setShieldRotation(angle);
      }
    };

    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          updateShieldPosition(self.progress);
        },
      },
    });

    // Initial animation
    gsap.fromTo(
      {},
      { progress: 0 },
      {
        progress: 1,
        duration: 2,
        ease: 'power1.inOut',
        onUpdate: function () {
          updateShieldPosition(this.progress());
        },
      }
    );
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