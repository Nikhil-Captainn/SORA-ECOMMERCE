import { useMemo } from "react";

export function SparkleBackground() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 4 + Math.random() * 10,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {sparkles.map(s => (
        <span
          key={s.id}
          className="block rounded-full animate-sparkle"
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            filter: "blur(0.5px)",
            animationDelay: `${s.delay}s`,
            background: "radial-gradient(circle, rgba(255,184,77,0.9) 0%, rgba(255,184,77,0.0) 70%)"
          }}
        />
      ))}
    </div>
  );
}
