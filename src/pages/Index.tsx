import React from 'react';
import AnimatedPath from '../components/ShieldPath/AnimatedPath';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center py-8">Interactive Shield Path</h1>
        <AnimatedPath />
      </div>
    </div>
  );
};

export default Index;