import React from 'react';

interface PathSegmentProps {
  direction: 'horizontal' | 'vertical' | 'diagonal';
  length: number;
  position: { x: number; y: number };
  angle?: number;
  id: string;
}

const PathSegment: React.FC<PathSegmentProps> = ({
  direction,
  length,
  position,
  angle = 0,
  id,
}) => {
  const getStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
      backgroundColor: '#FFD700',
    };

    if (direction === 'horizontal') {
      return {
        ...baseStyles,
        width: `${length}px`,
        height: '4px',
      };
    } else if (direction === 'vertical') {
      return {
        ...baseStyles,
        width: '4px',
        height: `${length}px`,
      };
    } else {
      return {
        ...baseStyles,
        width: `${length}px`,
        height: '4px',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'left center',
      };
    }
  };

  return <div id={id} className="path-segment" style={getStyles()} />;
};

export default PathSegment;