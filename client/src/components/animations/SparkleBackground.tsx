import React from 'react';

export function SparkleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sparkle elements */}
      <div className="absolute top-10 left-10 text-2xl animate-sparkle">✨</div>
      <div className="absolute top-20 right-20 text-xl animate-sparkle" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="absolute bottom-20 left-1/4 text-lg animate-sparkle" style={{ animationDelay: '2s' }}>✨</div>
      <div className="absolute top-1/3 right-1/3 text-xl animate-sparkle" style={{ animationDelay: '1.5s' }}>💫</div>
      <div className="absolute bottom-1/3 left-1/2 text-lg animate-sparkle" style={{ animationDelay: '0.5s' }}>⭐</div>
      <div className="absolute top-2/3 right-1/4 text-xl animate-sparkle" style={{ animationDelay: '2.5s' }}>✨</div>
    </div>
  );
}
