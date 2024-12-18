import React from 'react';
import { Shield } from 'lucide-react';

interface ShieldIconProps {
  position: { x: number; y: number };
  rotation: number;
}

const ShieldIcon: React.FC<ShieldIconProps> = ({ position, rotation }) => {
  return (
    <div
      className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
    >
      <Shield className="w-8 h-8 text-blue-600" />
    </div>
  );
};

export default ShieldIcon;