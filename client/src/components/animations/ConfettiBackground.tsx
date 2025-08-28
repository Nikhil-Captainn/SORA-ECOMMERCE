import React from 'react';

export function ConfettiBackground() {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
          style={{
            left: `${(i + 1) * 8}%`,
            animationDelay: `${i * 0.3}s`,
            backgroundColor: i % 3 === 0 
              ? 'hsl(var(--primary))' 
              : i % 3 === 1 
              ? 'hsl(var(--secondary))' 
              : 'hsl(var(--accent))',
          }}
        />
      ))}
    </div>
  );
}
